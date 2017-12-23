'use strict';

// Stats KEY
exports.STAT_MOOOD = 'moood';

// Moood Constants
exports.EMOTION_JOY         = 'joy';
exports.EMOTION_SADNESS     = 'sadness';
exports.EMOTION_FEAR        = 'fear';
exports.EMOTION_DISGUST     = 'disgust';
exports.EMOTION_ANGER       = 'anger';

// Moood Types
var mooodTypes = [];
mooodTypes[this.EMOTION_JOY] = 5;
mooodTypes[this.EMOTION_SADNESS] = -1;
mooodTypes[this.EMOTION_FEAR] = 1;
mooodTypes[this.EMOTION_DISGUST] = -1;
mooodTypes[this.EMOTION_ANGER] = -2;
exports.mooodTypes = mooodTypes;

// Moood Smiles List
var mooodSmilesList = [];
mooodSmilesList[this.EMOTION_JOY] = [":wink:", ":blush:", ":slightly_smiling_face:", ":kissing_closed_eyes:", ":relaxed:", ":relieved:"];
mooodSmilesList[this.EMOTION_SADNESS] = [":disappointed:", ":worried:", ":tired_face:", ":pensive:"];
mooodSmilesList[this.EMOTION_FEAR] = [":fearful:", ":open_mouth:"];
mooodSmilesList[this.EMOTION_DISGUST] = [":zipper_mouth_face:"];
mooodSmilesList[this.EMOTION_ANGER] = [":triumph:"];
exports.mooodSmilesList = mooodSmilesList;

// List of CMD and SUB CMD
exports.cmdList = ['stats','help','hey','crosscheck'];
exports.cmdSubList = ['today','me'];
exports.cmdDetail = {
    'STATS' : {
        'TODAY' : 'STATS TODAY' + "\r" + '> _Info_: All user\'s today stats' + "\r",
        'ME' : 'STATS ME' + "\r" + '> _Info_: Only this user\'s stats' + "\r"
    },
    'CROSSCHECK' : 'CROSSCHECK' + "\r",
    'HELP' : 'HELP' + "\r"
};