export const addCreatedHook = (MongooseSchema) => {
  MongooseSchema.pre("save", function preSave(next) {
    if (!this.createdDate) {
      this.createdDate = Math.floor(Date.now() / 1000);
    }
    next();
  });
};
