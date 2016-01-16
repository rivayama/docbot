# Docbot

Slack bot helps you to create documents. Document will be posted to your [Qiita:Team][1].

## Setup

	$ git clone https://github.com/rivayama/docbot.git
	$ cd docbot
	$ npm install

Then you'll need to set following environment variables.

	$ export SLACK_API_TOKEN=your_slack_api_token_here
	$ export QIITA_TEAM_ID=your_qiita_team_id_here
	$ export QIITA_ACCESS_TOKEN=your_qiita_access_token_here

- Slack API token: https://my.slack.com/services/new/bot
- Qiita access token: https://qiita.com/settings/tokens/new

## Run bot

	$ npm start

## Usage

### Templates

You can create and confirm templates by following commands:

	@docbot: create template _template name_
	@docbot: list templates
	@docbot: show template _template name_

### Documents

You can create and confirm documents by following commands:

	@docbot: create document _template name_
	@docbot: list documents
	@docbot: show document _document name_

For more info, see `help`.

	@docbot: help

Enjoy!

[1]: https://teams.qiita.com/

