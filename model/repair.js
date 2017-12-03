var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RepairSchema = new Schema({
    asset_name: String,
    asset_model: String,
    asset_repair_cost: String,
    asset_description: String
},
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' }
    });

var Repair = mongoose.model('Repair', RepairSchema);

module.exports = {
    'Repair': Repair
}
