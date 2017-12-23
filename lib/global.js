'use strict';

exports.globalData = {
    mooodyChannels: {},
    team: null,
    users: {},
    channels: {}
};

exports.set = function(data) {
    this.globalData = data;
};

exports.get = function() {
    return this.globalData;
};

exports.setTeam = function(data) {
    this.globalData.team = data;
};

exports.getTeam = function() {
    return this.globalData.team;
};

exports.getTeamId = function() {
    return (this.globalData.team.hasOwnProperty('id'))
        ? this.globalData.team.id
        : null
    ;
};

exports.getTeamName = function() {
    return (this.globalData.team.hasOwnProperty('name'))
        ? this.globalData.team.name
        : null
    ;
};

exports.getTeamDomain = function() {
    return (this.globalData.team.hasOwnProperty('domain'))
        ? this.globalData.team.domain
        : null
    ;
};

exports.setUsers = function(data) {
    this.globalData.users = data;
};

exports.getUsers = function() {
    return this.globalData.users;
};

exports.getOneUser = function(id) {
    return (this.globalData.users.hasOwnProperty(id))
        ? this.globalData.users[id]
        : null
    ;
};

exports.getOneUserName = function(id) {
    return (this.globalData.users.hasOwnProperty(id))
        ? this.globalData.users[id].name
        : null
    ;
};

exports.getOneUserRealName = function(id) {
    return (this.globalData.users.hasOwnProperty(id))
        ? this.globalData.users[id].real_name
        : null
    ;
};

exports.getOneUserColor = function(id) {
    return (this.globalData.users.hasOwnProperty(id))
        ? this.globalData.users[id].color
        : null
    ;
};

exports.setChannels = function(data) {
    this.globalData.channels = data;
};

exports.getChannels = function() {
    return this.globalData.channels;
};

exports.getOneChannel = function(id) {
    return (typeof this.globalData.channels[id] === 'undefined')
        ? null
        : this.globalData.channels[id]
    ;
};

exports.setMooodyChannels = function (data) {
    this.globalData.mooodyChannels = data;
};

exports.getMooodyChannels = function () {
    return this.globalData.mooodyChannels;
};