const softDelete = (schema) => {
  schema.statics.softDelete = async function (id) {
    const response = await this.findByIdAndUpdate(id, { $set: { active: new Date() }});
    return response;
  };

  schema.statics.restore = async function (id) {
    return this.findByIdAndUpdate(id, { $unset: { active: null } }, { new: true });
  };

  schema.pre(/^find/, function () {
    this.where({ active: { $exists: false } });
  });

  schema.pre('findOne', function () {
    this.where({ active: { $exists: false } });
  });

  schema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (!update.active) {
      this.setUpdate({ ...update, $set: { active: new Date() } });
    }
  });
}

export default softDelete;