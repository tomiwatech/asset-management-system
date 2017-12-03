var express = require('express');
var RepairService = require('../service/repair-service');
var router = express.Router();

/* GET Repair listing. */
router.get('/', function (req, res, next) {

    RepairService.allRepairs(function (err, repair) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error fetching Repair'
            });
        }


        if (repair) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully fetched Repairs',
                'repair': repair
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'No Repair in db'
        });
    });
});

/* POST adds an new Repair. */
router.post('/', function (req, res, next) {
    var repair = req.body;
    console.log(repair.asset_name);
    RepairService.addRepair(repair, function (err, repair) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error adding Repair'
            });
        }

        if (repair) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully added Repair'
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'Repair exists already'
        });
    });
})



/* POST deletes a Repair's record. */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    RepairService.deleteRepair(id, function (err) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error deleting Repair'
            });
        }

        return res.json({
            'responseCode': '00',
            'responseMessage': 'Successfully deleted Repair'
        });
    });
})

module.exports = router;
