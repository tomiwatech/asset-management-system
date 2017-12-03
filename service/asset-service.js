var Asset = require ('../model/asset').Asset;

var AssetService = {};

AssetService.findAsset = function(asset_serial_number, next){
    Asset.findOne({asset_serial_number : asset_serial_number}, function(err, asset){
        return next(err, asset);
    });
}

AssetService.addAsset = function(data, next){
    this.findAsset(data.asset_serial_number, function(err, asset){
        if(err){
            console.log('Encountered error when searching if the Asset is in the db already');
            return next(err, null);
        }

        if(asset){
            console.log('Asset with name ' + asset.asset_name + ' exists already.');
            return next(null, null);
        }
        else{
            /*Add Asset to db*/

            var newAsset = new Asset({
                asset_name: data.asset_name,
                asset_model: data.asset_model,
                asset_serial_number: data.asset_serial_number,
                asset_manufacturer: data.asset_manufacturer,
                asset_status: data.asset_status,
                asset_purchase_date: data.asset_purchase_date,
                asset_type: data.asset_type,
                asset_price: data.asset_price,
                asset_expiry_date: data.asset_expiry_date
            });

            newAsset.save(function(err, asset){
                return next(err, asset);
            })
        }
    })
}

AssetService.checkAsset = function(data, next){
    this.findAsset(data.Assetname, function(err, asset){
        if(err){
            console.log('Encountered error when searching if the Asset is in the db already');
            return next(err, null);
        }

        if(asset){
            console.log('Asset with merchantId ' + asset.assetname + ' exists already.');
            return next(null, null);
        }
        else{
            /*Add Asset to db*/
            var newAsset = new Asset({
                assetname: data.assetname,
                fullname: data.fullname,
                email: data.email,
                password: data.password
            });

            newAsset.save(function(err, Asset){
                return next(err, Asset);
            })
        }
    })
}

AssetService.allAssets = function(next){
    Asset.find(function(err, assets){
        return next(err, assets);
    });
}

AssetService.countAll = function(next){
    Asset.count(function(err,asset){
        return next(err,asset);
    })
}

AssetService.deleteAsset = function (id, next) {

    Asset.remove({"_id" : id}, function (err) {
        return next(err);
    });
}

module.exports = AssetService;