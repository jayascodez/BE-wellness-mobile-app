import db from '../connection.js';

async function seed({ activitiesData, journalData, moodData, userData }) {
	try {
		await deleteCollection(db, 'Moods', moodData.length);
		await deleteCollection(db, 'Activities', activitiesData.length);
		await deleteCollection(db, 'Journal entries', journalData.length);
		await deleteCollection(db, 'Users', userData.length);

		moodData.forEach(async (mood) => {
			console.log('inputting mood to db');
			const moodRef = db.collection('Moods').doc(`${mood.emotion}`);
			await moodRef.set(mood);
		});

		activitiesData.forEach(async (activity) => {
			const activitiesRef = db
				.collection('Activities')
				.doc(`${activity.title}`);
			await activitiesRef.set(activity);
		});

		journalData.forEach(async (entry, index) => {
			const journalRef = db.collection('Journal entries').doc(`${index}`);
			await journalRef.set(entry);
		});

		userData.forEach(async (user, index) => {
			const userRef = db.collection('Users').doc(`${index}`);
			await userRef.set(user);
		});
	} catch (err) {
		console.log(err);
	}
}

// From Firestore docs
async function deleteCollection(db, collectionPath, batchSize) {
	const collectionRef = db.collection(collectionPath);
	const query = collectionRef.orderBy('__name__').limit(batchSize);

	return new Promise((resolve, reject) => {
		deleteQueryBatch(db, query, resolve).catch(reject);
	});
}

async function deleteQueryBatch(db, query, resolve) {
	const snapshot = await query.get();

	const batchSize = snapshot.size;
	if (batchSize === 0) {
		// When there are no documents left, we are done
		resolve();
		return;
	}

	// Delete documents in a batch
	const batch = db.batch();
	snapshot.docs.forEach((doc) => {
		batch.delete(doc.ref);
	});
	await batch.commit();

	// Recurse on the next process tick, to avoid
	// exploding the stack.
	process.nextTick(() => {
		deleteQueryBatch(db, query, resolve);
	});
}

export default seed;
