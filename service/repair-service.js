var Repair = require ('../model/repair').Repair;

var RepairService = {};

RepairService.findRepair = function(model, next){
    Repair.findOne({asset_model : model}, function(err, repair){
        return next(err, repair);
    });
}

RepairService.addRepair = function(data, next){
    this.findRepair(data.asset_model, function(err, repair){
        if(err){
            console.log('Encountered error when searching if the Repair is in the db already');
            return next(err, null);
        }

        if(repair){
            console.log('Repair with name ' + data.asset_name + ' exists already.');
            return next(null, null);
        }
        else{
            /*Add Repair to db*/

            var newRepair = new Repair({
                asset_name: data.asset_name,
                asset_model: data.asset_model,
                asset_repair_cost: data.asset_repair_cost,
                asset_description: data.asset_description
            });

            newRepair.save(function(err, repair){
                return next(err, repair);
            })
        }
    })
}

RepairService.checkRepair = function(data, next){
    this.findRepair(data.Repairname, function(err, Repair){
        if(err){
            console.log('Encountered error when searching if the Repair is in the db already');
            return next(err, null);
        }

        if(Repair){
            console.log('Repair with merchantId ' + Repair.Repairname + ' exists already.');
            return next(null, null);
        }
        else{
            /*Add Repair to db*/
            var newRepair = new Repair({
                Repairname: data.Repairname,
                fullname: data.fullname,
                email: data.email,
                password: data.password
            });

            newRepair.save(function(err, Repair){
                return next(err, Repair);
            })
        }
    })
}

RepairService.allRepairs = function(next){
    Repair.find(function(err, repairs){
        return next(err,repairs);
    });
}

RepairService.deleteRepair = function (id, next) {

    Repair.remove({"_id" : id}, function (err) {
        return next(err);
    });
}

module.exports = RepairService;