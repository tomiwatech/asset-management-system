var express = require('express');
var AssetService = require('../service/asset-service');
var router = express.Router();

/* GET assets listing. */
router.get('/', function (req, res, next) {

    AssetService.allAssets(function (err, assets) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error fetching assets'
            });
        }


        if (assets) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully fetched assets',
                'assets': assets
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'No assets in db'
        });
    });
});

//Find One
router.post('/authenticate', function (req, res, next) {
    var data = req.body;
    console.log(data.assetname);
    AssetService.findAsset(data.assetname, function (err, asset) {
        if (err) throw err;
        if (!asset) {
            res.json({
                responseCode: "02",
                responseMessage: 'Authentication failed. asset not found.',
            });
        } else if (asset) {
            // check if assetname matches
            if (asset.password != req.body.password) {
                res.json({
                    responseCode: "03",
                    responseMessage: 'Authentication failed. Password not found.',
                });
            } else {
                // if asset is found and password is right
                // return the information including token as JSON
                res.json({
                    responseCode: "00",
                    responseMessage: "Authentication Successful",
                    asset: asset
                });
            }

        }

    })
});

/* POST adds an new asset. */
router.post('/', function (req, res, next) {
    var asset = req.body;
    console.log(asset.asset_name);
    AssetService.addAsset(asset, function (err, assets) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error adding asset'
            });
        }

        if (assets) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully added asset'
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'asset exists already'
        });
    });
})



/* POST deletes a asset's record. */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    AssetService.deleteAsset(id, function (err) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error deleting asset'
            });
        }

        return res.json({
            'responseCode': '00',
            'responseMessage': 'Successfully deleted asset'
        });
    });
})

module.exports = router;
