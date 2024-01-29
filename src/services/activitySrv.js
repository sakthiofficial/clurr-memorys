class ActivitySrv {
  constructor(providedUser, actionType) {
    this.actionType = actionType;
    this.providedUser = providedUser;
  }

  createActivity = (activityType, entityId, performedId) => {
    // add //edit //delete //permission
  };
}
export default ActivitySrv;
