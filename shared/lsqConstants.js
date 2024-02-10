export const lsqLeadFieldNames = {
  leadId: "ProspectID",
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
  duplicateMax: "Duplicate Max",
  duplicate: "Duplicate",
  exist: "Exist",
};

const lsqActivityCode = {
  svd: 30002,
};

const customLsqField = {
  leadRegistration: "LeadRegistration",
};
const lsqErrorMsg = {
  emailError: "A Lead with same Email already exists.",
};
const clientAppLsqMsg = {
  newLeadCreated: "Your new lead has been successfully created",
  existLeadCreated: "An existing lead has been created",
};
export { lsqActivityCode, customLsqField, lsqErrorMsg, clientAppLsqMsg };
