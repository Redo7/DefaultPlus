let totalMessages = 0, messagesLimit = 0, removeSelector, removeUpdateSelector, provider, nickStyle = '{{nickStyle}}', hideAfter, animationOut, textAlign, checkForUpdatesOnWidgetLoad;
let ignoredUsers = [];
const replyIcon = '<svg style="transform: scaleX(-1);" xmlns="http://www.w3.org/2000/svg" height="{{fontSize}}" fill="#ffffff" viewBox="0 96 960 960" width="{{fontSize}}"><path d="M805.063 863.999q-17.755 0-31.37-13.624Q760.078 836.75 760.078 819V701q0-49.167-34.417-83.584t-83.584-34.417H282.229l110.924 111.925q13.308 13.146 13.308 30.995 0 17.85-14.391 32.241-13.609 13.609-31.493 13.609T329 758.076L146.231 575.307q-8.615-8.615-12.423-17.897-3.807-9.282-3.807-18.461 0-9.18 3.807-18.41 3.808-9.231 12.423-17.846L330 318.924q13.147-13.308 30.996-13.808 17.85-.5 32.241 13.891 13.608 13.609 13.608 31.493t-13.692 31.576L282.229 493.001h359.848q86.849 0 147.424 60.575Q850.076 614.15 850.076 701v118q0 17.75-13.629 31.375-13.628 13.624-31.384 13.624Z"/></svg>';

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
  	console.log(fieldData)
    messagesLimit = fieldData.msgLimit;
    animationIn = fieldData.animationIn;
    animationOut = fieldData.animationOut;
    hideAfter = fieldData.hideAfter;
    checkForUpdatesOnWidgetLoad = fieldData.checkForUpdatesOnWidgetLoad;
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider;
    });
  
    if (fieldData.chatDirection === "column-reverse") {
        removeSelector = ".message-box:nth-child(n+" + (messagesLimit + 1) + ")"
    } else {
        removeSelector = ".message-box:nth-last-child(n+" + (messagesLimit + 1) + ")"
    }
  
    ignoredUsers = fieldData.ignoredUsers.toLowerCase().replaceAll(" ", "").split(",");

    var updateStatus, updateClass;
    if (checkForUpdatesOnWidgetLoad === true) {
        fetch('https://raw.githubusercontent.com/Redo7/DefaultPlus/main/data.json')
            .then(response => response.json()).then((output) => {
                if (output.widgetVersion > '{{widgetVersion}}') {
                    updateStatus = 'Widget update available. Download it from https://github.com/Redo7/DefaultPlus/releases';
                  	updateClass = 'warning'
                } else {
                    updateStatus = 'Widget is up to date';
                  	updateClass = 'success'
                }
                const updateNotif = $.parseHTML(`<p class="update-notif ${updateClass} {{animationIn}} animated">${updateStatus}</p>`);
                $(updateNotif).appendTo('.main-container')
                $('.update-notif').delay(5000).queue(function () { $('.update-notif').addClass(animationOut).dequeue() }).delay(1000).queue(function () {
                    $(this).remove().dequeue()
                });
                $('.update-notif').animate({
                    height: 0,
                    opacity: 0
                }, 'slow', function () {
                    $('.update-notif').remove();
                });
            })
    }
});

window.addEventListener('onEventReceived', function (obj) {

    //Buttons

    if (obj.detail.event.listener === 'widget-button') {
      	//Version Check
        if (obj.detail.event.field === 'checkForUpdates') {
            
            var updateStatus, updateClass;
            fetch('https://raw.githubusercontent.com/Redo7/DefaultPlus/main/data.json')
                .then(response => response.json()).then((output) => {
                    if (output.widgetVersion > '{{widgetVersion}}') {
                        updateStatus = 'Widget update available';
                        updateClass = 'warning'
                    } else {
                        updateStatus = 'Widget is up to date';
                        updateClass = 'success'
                    }
                    const updateNotif = $.parseHTML(`<p class="update-notif ${updateClass} {{animationIn}} animated">${updateStatus}</p>`);
                    $(updateNotif).appendTo('.main-container');
                    $('.update-notif').delay(5000).queue(function () { $('.update-notif').addClass(animationOut).dequeue() }).delay(1000).queue(function () {
                        $(this).remove().dequeue()
                    });
                    $('.update-notif').animate({
                        height: 0,
                        opacity: 0
                    }, 'slow', function () {
                        $('.update-notif').remove();
                    });
                })

        }
    }

    //Follow Alert

    if (obj.detail.listener === 'follower-latest') {
        let event = obj['detail']['event'];
        let eventUsername = event['name'];
        let eventSound = new Audio('{{alertSound}}');
        let eventSoundVolume = '{{alertSoundVolume}}';
        let displayFollows = ('{{displayFollows}}' === 'true');

        let colour = '#edaa1b';
        let nameColour = '#fdc97c';
        let badgeText = 'New Follower!';

        if (displayFollows) {
            let text = event['name'] + ' just followed!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        }
        return;
    }

    //Sub Alert

    if (obj.detail.listener === 'subscriber-latest') {
        let event = obj['detail']['event'];
        let bulkGifted = event['bulkGifted'];
        let isCommunityGift = false;
        let gifted = false;
        isCommunityGift = event['isCommunityGift'];
        gifted = event['gifted'];
        let eventUsername = event['name'];
        let eventSound = new Audio('{{alertSound}}');
        let eventSoundVolume = '{{alertSoundVolume}}';
        let displayBulkGifted = ('{{displayBulkGifted}}' === 'true');
        let displayGifted = ('{{displayGifted}}' === 'true');
        let displayResubs = ('{{displayResubs}}' === 'true');
        let displaySubs = ('{{displaySubs}}' === 'true');

        let colour = '#8a2be2';
        let nameColour = '#b96eff';

        if (isCommunityGift) { return };
        if (bulkGifted && displayBulkGifted) {
            let badgeText = 'New Gifted Subs!';
            let text = event['name'] + ' gifted ' + event['amount'] + ' subs!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        } else if (gifted && displayGifted) {
            let badgeText = 'New Gifted Sub!';
            let text = event['sender'] + ' gifted a sub to ' + event['name'] + '!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        } else if (event['amount'] > 1 && displayResubs) {
            let badgeText = 'New Resub!';
            let text = event['name'] + ' subscribed for ' + event['amount'] + ' months!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        } else if (displaySubs) {
            let badgeText = 'New Subscriber!';
            let text = event['name'] + ' just subscribed!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        }
        return;
    }

    //Donation Alert

    if (obj.detail.listener === 'tip-latest') {
        let event = obj['detail']['event'];
        let eventUsername = event['name'];
        let eventSound = new Audio('{{alertSound}}');
        let eventSoundVolume = '{{alertSoundVolume}}';
        let displayDonations = ('{{displayDonations}}' === 'true');
        let userCurrency = '{{userCurrency}}'

        let colour = '#7ae759';
        let nameColour = '#8fe774';
        let badgeText = 'New Donation!';

        if (displayDonations && event['amount'] >= '{{minDonationAmount}}') {
            let text = event['name'] + ' donated ' + userCurrency + event['amount'] + '!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        }
        return;
    }

    //Cheer Alert

    if (obj.detail.listener === 'cheer-latest') {
        let event = obj['detail']['event'];
        let eventUsername = event['name'];
        let eventSound = new Audio('{{alertSound}}');
        let eventSoundVolume = '{{alertSoundVolume}}';
        let displayCheers = ('{{displayCheers}}' === 'true');

        let colour = '#1bcded';
        let nameColour = '#7ceafd';
        let badgeText = 'New Cheer!';

        if (displayCheers && event['amount'] >= '{{minCheerAmount}}') {
            let text = event['name'] + ' cheered X' + event['amount'] + '!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        }
        return;
    }

    //Raid Alert

    if (obj.detail.listener === 'raid-latest') {
        let event = obj['detail']['event'];
        let eventUsername = event['name'];
        let eventSound = new Audio('{{alertSound}}');
        let eventSoundVolume = '{{alertSoundVolume}}';
        let displayRaids = ('{{displayRaids}}' === 'true');

        let colour = '#ed1b53';
        let nameColour = '#f14f7a';
        let badgeText = 'New Raid Incoming!';

        if (displayRaids) {
            let text = event['name'] + ' is raiding with ' + event['amount'] + ' viewers!';
            addAlert(text, colour, nameColour, badgeText, eventSound, eventSoundVolume);
        }
        return;
    }

    if (obj.detail.listener === "delete-message") {
        const msgId = obj.detail.event.msgId;
        $(`.message-box[data-msgid=${msgId}]`).remove();
        return;
    } else if (obj.detail.listener === "delete-messages") {
        const uId = obj.detail.event.userId;
        $(`.message-box[data-sender=${uId}]`).remove();
        return;
    }

    //Message

    if (obj.detail.listener === "message") {
        let event = obj['detail']['event'];
        let data = event['data'];
        if (ignoredUsers.indexOf(data.nick) !== -1) return;
        let message = attachEmotes(data);
        let username = data['displayName'];
        let replyTo = null;
        let replyBody = null;
        let replyStyle = 'none';
        if (data.tags['reply-parent-display-name']) {
            replyTo = data.tags['reply-parent-display-name'];
            if (data.tags['reply-parent-msg-body'].length > 32) {
                replyBody = html_encode(data.tags['reply-parent-msg-body'].replaceAll("\\s", " ").substring(0, 23).concat('...'));
            } else {
                replyBody = html_encode(data.tags['reply-parent-msg-body'].replaceAll("\\s", " "));
            }
            replyStyle = 'flex';
        }
        if ('{{displayBadges}}' === 'true') {
            var badges = "", badge;
            for (let i = 0; i < data.badges.length; i++) {
                badge = data.badges[i];
                badges += `<img alt="" src="${badge.url}" class="badge ${badge.type}-icon"> `;
            }
        } else {
            var badges = '';
        }
        if (nickStyle === "user") {
            if ('{{useNicknameShadow}}' === 'true') {
                if ('{{nicknameShadowColourType}}' === 'user') {
                    var colour = data.displayColor;
                    var shadow = colour + ' ' + '{{nicknameShadow}}';
                } else {
                    var colour = data.displayColor;
                    var shadowColour = '{{nicknameShadowColour}} ';
                    var shadow = shadowColour + ' ' + '{{nicknameShadow}}';
                }
                username = `<p class="username" style="font-weight: bold; color:${colour}; text-shadow: ${shadow};">${username}</p>`;
            } else {
                var colour = data.displayColor;
                username = `<p class="username" style="font-weight: bold; color:${colour};">${username}</p>`;
            }
        }
        else if (nickStyle === "custom") {
            if ('{{useNicknameShadow}}' === 'true') {
                if ('{{nicknameShadowColourType}}' === 'user') {
                    var colour = '{{nickColour}}';
                    var shadowColour = data.displayColor;
                    var shadow = shadowColour + ' ' + '{{nicknameShadow}}';
                } else {
                    var colour = '{{nickColour}}';
                    var shadowColour = data.displayColor;
                    var shadow = shadowColour + ' ' + '{{nicknameShadow}}';
                }
                username = `<p class="username" style="font-weight: bold; color:${colour}; text-shadow: ${shadow};">${username}</p>`;
            } else {
                var colour = '{{nickColour}}';
                username = `<p class="username" style="font-weight: bold; color:${colour};">${username}</p>`;
            }
        }

        let pronoun = null;
        let pronounStyle = null;

        const pronoun_api = fetch('https://pronouns.alejo.io/api/users/' + data.displayName.toLowerCase())
            .then((response) => response.json())
            .then((user) => {
                if (!user.length) {
                    return null;
                } else return user[0].pronoun_id;
            });

        const printAddress = async () => {
            pronoun = await pronoun_api;
            switch (pronoun) {
                case "aeaer":
                    pronoun = "ae/aer";
                    break;
                case "eem":
                    pronoun = "e/em";
                    break;
                case "faefaer":
                    pronoun = "fae/faer";
                    break;
                case "hehim":
                    pronoun = "he/him";
                    break;
                case "heshe":
                    pronoun = "he/she";
                    break;
                case "hethem":
                    pronoun = "he/they";
                    break;
                case "itits":
                    pronoun = "it/its";
                    break;
                case "perper":
                    pronoun = "per/per";
                    break;
                case "sheher":
                    pronoun = "she/her";
                    break;
                case "shethem":
                    pronoun = "she/they";
                    break;
                case "theythem":
                    pronoun = "they/them";
                    break;
                case "vever":
                    pronoun = "ve/ver";
                    break;
                case "xexem":
                    pronoun = "xe/xem";
                    break;
                case "ziehir":
                    pronoun = "zie/hir";
                    break;
                default:
                    break;
            }
            return pronoun;
        }

        printAddress().then(pronoun => addMessage(replyTo, replyBody, replyStyle, badges, username, pronoun, pronounStyle, message, data.userId, data.msgId));
    }
});

function addMessage(replyTo, replyBody, replyStyle, badges, username, pronoun, pronounStyle, message, uId, msgId) {
    if ('{{alignMessages}}' === 'flex-end' && message.includes('http')) {
        textAlign = 'right';
    } else {
        textAlign = 'initial';
    }
    if (message.startsWith("!") && '{{showCommands}}' === 'false') { return }
    else if (message.startsWith("@") && replyBody) {
        let messageNoTag = message.split(' ');
        messageNoTag.shift()
        message = messageNoTag.join(' ');
    }
  	const mentions = message.match(/@\S+/g)
    if (mentions) {
        for (var i = 0; i < mentions.length; i++) {
            message = message.replace(mentions[i], `<p style="display: inline; color: {{nameHighlighColour}}; font-weight: 800;">${mentions[i]}</p>`)
        }
    }
    if ('{{displayPronouns}}' === 'false') {
        pronounStyle = 'none';
    } else if (pronoun == null) {
        pronounStyle = 'none';
    } else {
        pronounStyle = 'block';
    }
    totalMessages += 1;
    const element = $.parseHTML(`
	<div data-sender="${uId}" data-msgId="${msgId}" class="message-box {{animationIn}} animated" id="msg-${totalMessages}">
	  <div class="reply {{animationIn}} animated" style="display: ${replyStyle}">
		<span style="opacity: .5; align-self: center;">
			${replyIcon}&nbsp;
		</span>
		<span style="color: {{nameHighlighColour}}; font-weight: 800;">
			${replyTo}:
		</span>
		&nbsp;${replyBody}
	  </div>
	  <div class="user-wrap">
      	<div class="badge-container">${badges}</div>
		${username}
		<p class="pronoun" style="display: ${pronounStyle};">${pronoun}</p>
      </div>
      <div class="message-wrap" style="text-align: ${textAlign}">
          <p class="message">${message}</p>
      </div>
	</div>`);
  
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).queue(function () {
            $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove()
            }).dequeue();
        });
    } else {
        $(element).appendTo('.main-container');
    }
    if ('{{useMsgShadow}}' === 'true') {
        const msgShadow = `{{msgShadow}}`;
        $('.message-wrap').css({ 'text-shadow': msgShadow });
    } else {
        const msgShadow = 'rgba(0,0,0,0) 0 0 0px';
        $('.message-wrap').css({ 'text-shadow': msgShadow });
    }
    if('{{msgBackground}}' === 'custom'){
       $('.message-box').css({ 'padding': '10px 20px', 'background': '{{customMsgBackground}}'});
    } else if ('{{msgBackground}}' === 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)') {
       $('.message-box').css({ 'padding': '0px 20px', 'background': '{{msgBackground}}'});
    } else {
       $('.message-box').css({ 'padding': '10px 20px', 'background': '{{msgBackground}}'});
    }
    if (totalMessages > messagesLimit) {
        removeRow();
    }
}

function addAlert(text, colour, nameColour, badgeText, sound, soundVolume) {
    totalMessages += 1;
  	if('{{msgBackground}}' === 'custom'){
       	var mainBg = '{{customMsgBackground}}';
       } else {
       	var mainBg = '{{msgBackground}}';
       }
  
    if ('{{alignMessages}}' === 'flex-end') {
        var alertBg = `${mainBg}, linear-gradient(90deg, ${colour}00 50%, ${colour}40 100%)`;
        var border = `border-right: ${colour} 10px solid`;
    } else if ('{{alignMessages}}' === 'flex-start') {
        var alertBg = `${mainBg}, linear-gradient(270deg, ${colour}00 50%, ${colour}40 100%)`;
        var border = `border-left: ${colour} 10px solid`;
    } else {
        var alertBg = `${mainBg}, linear-gradient(180deg, ${colour}00 50%, ${colour}40 100%)`;
        var border = `border-bottom: ${colour} 5px solid`;
    }
    const alert = $.parseHTML(`
	<div class="message-box alert {{animationIn}} animated" style="background: ${alertBg}; ${border};" id="msg-${totalMessages}">
      <div class="user-wrap">
        <p class="username" style="font-weight: bold; color: ${nameColour}; text-shadow: ${colour} 0 0 10px;">${badgeText}</p>
      </div>
	  <div class="message-wrap">
        <p class="message alert-message">${text}</p>
      </div>
	</div>`);
    if (hideAfter !== 999) {
        $(alert).appendTo('.main-container').delay(hideAfter * 1000).queue(function () {
            $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove()
            }).dequeue();
        });
    } else {
        $(alert).appendTo('.main-container');
    }
    if ('{{useMsgShadow}}' === 'true') {
        const msgShadow = `{{msgShadow}}`;
        $('.message-wrap').css({ 'text-shadow': msgShadow });
    } else {
        const msgShadow = 'rgba(0,0,0,0) 0 0 0px';
        $('.message-wrap').css({ 'text-shadow': msgShadow });
    }
  	if('{{msgBackground}}' === 'custom'){
       $('.message-box').css({ 'padding': '10px 20px'});
    } else if ('{{msgBackground}}' === 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)') {
       $('.message-box').css({ 'padding': '0px 20px'});
    } else {
       $('.message-box').css({ 'padding': '10px 20px'});
    }
    playAlertSound(sound, soundVolume)
    if (totalMessages > messagesLimit) {
        removeRow();
    }
}

function playAlertSound(sound, soundVolume) {
    sound.volume = soundVolume;
    sound.play();
    if (sound.currentTime == sound.duration) {
        sound.pause();
        sound.currentTime = 0;
    }
}

function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    if (typeof message.attachment !== "undefined") {
        if (typeof message.attachment.media !== "undefined") {
            if (typeof message.attachment.media.image !== "undefined") {
                text = `${message.text}<img src="${message.attachment.media.image.src}">`;
            }
        }
    }
    return text.replace(/([^\s]*)/gi, function (m, key) {
        let result = data.filter(emote => {
            return html_encode(emote.name) === key
        });
        if (typeof result[0] !== "undefined") {
            let url = result[0]['urls'][1];
            if (provider === "twitch") {
                return `<img class="emote" src="${url}"/>`;
            } else {
                if (typeof result[0].coords === "undefined") {
                    result[0].coords = { x: 0, y: 0 };
                }
                let x = parseInt(result[0].coords.x);
                let y = parseInt(result[0].coords.y);

                let height = "{{emoteSize}}px";
                let width = "{{emoteSize}}px";
                if (provider === "mixer") {
                    if (result[0].coords.width) {
                        width = `${result[0].coords.width}px`;
                    }
                    if (result[0].coords.height) {
                        height = `${result[0].coords.height}px`;
                    }
                }
                return `<div class="emote" style="width: ${width}; height:${height}; display: inline-block; background-image: url(${url});"></div>`;
            }
        } else return key;
    }
    );
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function removeRow() {
    if (!$(removeSelector).length) {
        return;
    }
    if (animationOut !== "none" || !$(removeSelector).hasClass(animationOut)) {
        if (hideAfter !== 999) {
            $(removeSelector).dequeue();
        } else {
            $(removeSelector).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove().dequeue()
            });

        }
        return;
    }

    $(removeSelector).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(removeSelector).remove();
    });
}
