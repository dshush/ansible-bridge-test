
var express = require("express");
var Ansible = require('node-ansible');

var default_inventory = "/etc/ansible/hosts";
var app = express();

app.listen(3000);

// handle command running request
app.get('/command/:module/:hosts/:args', function(req, res) {
    var command = new Ansible.AdHoc().module(req.params.module).hosts(req.params.hosts).args(req.params.args).inventory(default_inventory);
    execute(command, res);
});


// handle playbook running request
app.get('/playbook/:name*', function(req, res) {
    var playbook = new Ansible.Playbook().playbook(req.params.name).inventory(default_inventory);
    execute(playbook, res);
});

// execute executable using ansible and inform the user with the result and output
function execute(exec, res) {
    exec.exec().then(function(successResult) {

        if (successResult.code != 0) {
            res.status(400).send(successResult.output);
            console.log("1");
            return;
        }
        res.send(successResult.output);
        console.log("2");

    }, function(error) {
        res.status(400);
        res.send(error);
        console.log("3");
    })
}
