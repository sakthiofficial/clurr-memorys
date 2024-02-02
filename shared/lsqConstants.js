export const lsqLeadFieldNames = {
  project: "mx_Origin_Project",
  leadNumber: "ProspectAutoId",
  source: "Source",
  category: null,
  prospectStage: "ProspectStage",
  newLead: null,
  createdOn: "CreatedOn",
  origin: "Origin",
  agencyName: null,
  medium: null,
  createdDate: "CreatedOnDate",
  createdTime: "CreatedOnTime",
  phone: "Phone",
  remarks: null,
  activityEvent: null,
  ownerIdName: "OwnerIdName",
  campaign: "SourceCampaign",
  stage: "ProspectStage",
  agency: "mx_Agency_Name",
  subSource: "mx_Sub_Source",
  notes: "Notes",
  firstName: "FirstName",
  email: "EmailAddress",
};

export const lsqFieldValues = {
  source: "Channel Partner",
};
export const leadStage = {
  new: "New",
  reengaged: "Reengaged",
  progressReenged: "Progressing Reengaged",
  svd: "Site Visit Done",
  svdCold: "SVD Cold",
  svdWarm: "SVD Warm",
  svdDroped: "Site Visit Done & Dropped",
};
export const leadRegistrationStatus = {
  sucess: "Sucess",
  duplicate: "Duplicate",
  exist: "Exist",
};

export const leadRegistrationMapping = {
  [leadRegistrationStatus.sucess]: [leadStage.new],
  [leadRegistrationStatus.duplicate]: [
    leadStage.reengaged,
    leadStage.progressReenged,
    leadStage?.svdDroped,
  ],
  [leadRegistrationStatus.exist]: [
    leadStage?.svd,
    leadStage?.svdCold,
    leadStage?.svdWarm,
  ],
};
export const customLsqField = {
  leadRegistration: "LeadRegistration",
};
