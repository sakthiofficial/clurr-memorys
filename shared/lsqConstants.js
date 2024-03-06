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
// sv -> site visit
export const leadStage = {
  new: "New",
  reengaged: "Reengaged",
  progressReenged: "Progressing Reengaged",
  svDone: "Site Visit Done",
  svCold: "SVD Cold",
  svWarm: "SVD Warm",
  svDroped: "Site Visit Done & Dropped",
  svSchedule:"Site Visit Scheduled"
};
export const leadRegistrationStatus = {
  sucess: "Sucess",
  duplicateMax: "No Sv",
  duplicate: "Duplicate Sv Done",
  exist: "Exist",
};

const lsqActivityCode = {
  svd: 30002,
};

const customLsqField = {
  leadRegistration: "LeadRegistration",
  isCreatedInLsq:"isCreatedInLsq",
  isVisible:"isVisible"
};
const lsqErrorMsg = {
  emailError: "A Lead with same Email already exists.",
};
const clientAppLsqMsg = {
  newLeadCreated: "Your new lead has been successfully created",
  existLeadCreated: "An existing lead has been created",
};

const leadDataObj = {
  name: "name",
  createdBy: "createdBy",
  subSource: "subSource",
  email: "email",
  leadRegistration: "leadRegistration",
  phone:"phone",
  project:"project",
  created:"created",
  leadId:"leadId",
  notes:"notes",
  isCreatedInLsq:"isCreatedInLsq"
};
export { lsqActivityCode, customLsqField, lsqErrorMsg, clientAppLsqMsg ,leadDataObj};
