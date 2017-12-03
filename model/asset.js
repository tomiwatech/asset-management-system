var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AssetSchema = new Schema({
    asset_name: String,
    asset_serial_number: String,
    asset_manufacturer: String,
    asset_status: String,
    asset_purchase_date: String,
    asset_type: String,
    asset_price: Number,
    asset_expiry_date: String
},
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' }
    });

var Asset = mongoose.model('Asset', AssetSchema);

module.exports = {
    'Asset': Asset
}
