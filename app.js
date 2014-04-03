var express = require("express");
var Ansible = require('node-ansible');

var defaultInventory = "/etc/ansible/hosts";
var app = express();

app.listen(3000);

app.get('/command/:module/:hosts/:args', function (req, res) {
    var command = new Ansible.AdHoc().module(req.params.module).hosts(req.params.hosts).args(req.params.args)
        .inventory(defaultInventory);
    execute(command, res);
});

app.get('/playbook/:name*', function (req, res) {
    var playbook = new Ansible.Playbook().playbook(req.params.name).inventory(defaultInventory);
    execute(playbook, res);
});

function execute(exec, res) {
    exec.exec().then(function (successResult) {

        if (successResult.code != 0) {
            res.status(400).send(successResult.output);
            return;
        }
        res.send(successResult.output);

    }, function (error) {
        res.status(400);
        res.send(error);
    })
}
