import db from '../connection.js';

const fetchActivities = async () => {
	const activitiesArr = [];
	const activities = await db.collection('activities').get();
	activities.forEach((activity) => {
		activitiesArr.push(activity.data());
	});
	return activitiesArr;
};

export default fetchActivities;