export const addCreatedHook = (MongooseSchema) => {
  MongooseSchema.pre("save", function preSave(next) {
    if (!this.created) {
      this.created = Math.floor(Date.now() / 1000);
    }
    next();
  });
};
