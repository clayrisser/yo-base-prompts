import path from 'path';
import {
  guessAuthorEmail,
  guessAuthorName,
  guessUsername,
  guessProjectDescription,
  guessProjectDestination,
  guessProjectVersion,
  guessProjectName
} from 'project-guess';

export default class YoBasePrompts {
  constructor(yo) {
    this.yo = yo;
  }

  async prompt(prompts) {
    const result = {};
    if (!prompts || prompts.name) {
      this.name = result.name = await this.namePromt();
    }
    if (!prompts || prompts.destination) {
      this.destination = result.destination = await this.destinationPrompt(
        this.name
      );
    }
    if (!prompts || prompts.description) {
      this.description = result.description = await this.descriptionPrompt();
    }
    if (!prompts || prompts.version) {
      this.version = result.version = await this.versionPrompt();
    }
    if (!prompts || prompts.license) {
      this.license = result.license = await this.licensePrompt();
    }
    if (!prompts || prompts.authorName) {
      this.authorName = result.authorName = await this.authorNamePrompt();
    }
    if (!prompts || prompts.authorEmail) {
      this.authorEmail = result.authorEmail = await this.authorEmailPrompt();
    }
    if (!prompts || prompts.githubUsername) {
      this.githubUsername = result.githubUsername = await this.githubUsernamePrompt(
        this.email
      );
    }
    if (!prompts || prompts.authorUrl) {
      this.authorUrl = result.authorUrl = await this.authorUrlPrompt(
        this.githubUsername
      );
    }
    if (!prompts || prompts.repository) {
      this.repository = result.repository = await this.repositoryPrompt(
        this.githubUsername,
        this.name
      );
    }
    if (!prompts || prompts.homepage) {
      this.homepage = result.homepage = await this.homepagePrompt(
        this.repository
      );
    }
    return result;
  }

  async namePromt() {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'name',
      message: 'Project Name:',
      default: guessProjectName()
    });
  }

  async destinationPrompt(name) {
    const destination = await this.yo.optionOrPrompt({
      type: 'input',
      name: 'destination',
      message: 'Destination:',
      default: guessProjectDestination(name)
    });
    return path.resolve(destination);
  }

  async descriptionPrompt() {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'description',
      message: 'Project Description:',
      default: guessProjectDescription()
    });
  }

  async versionPrompt() {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: guessProjectVersion()
    });
  }

  async licensePrompt() {
    return this.yo.optionOrPrompt({
      type: 'list',
      name: 'license',
      message: 'License:',
      choices: [
        { name: 'MIT', value: 'MIT' },
        { name: 'Apache 2.0', value: 'Apache-2.0' },
        { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
        {
          name: 'BSD 2-Clause (FreeBSD) License',
          value: 'BSD-2-Clause-FreeBSD'
        },
        { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
        { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
        { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
        { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
        { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
        { name: 'Unlicense', value: 'unlicense' },
        { name: 'No License (Copyrighted)', value: 'UNLICENSED' }
      ],
      default: 'MIT'
    });
  }

  async authorNamePrompt() {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'authorName',
      message: 'Author Name:',
      default: guessAuthorName()
    });
  }

  async authorEmailPrompt() {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'authorEmail',
      message: 'Author Email:',
      default: guessAuthorEmail()
    });
  }

  async githubUsernamePrompt(authorEmail) {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'githubUsername',
      message: 'GitHub Username:',
      default: guessUsername(authorEmail)
    });
  }

  async authorUrlPrompt(githubUsername) {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'authorUrl',
      message: 'Author URL:',
      default: `https://${githubUsername}.com`
    });
  }

  async repositoryPrompt(githubUsername, name) {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'repository',
      message: 'Repository:',
      default: `https://github.com/${githubUsername}/${name}`
    });
  }

  async homepagePrompt(repository) {
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'homepage',
      message: 'Homepage:',
      default: repository
    });
  }

  async optionOrPrompt(config) {
    return (await this.yo.optionOrPrompt([config]))[config.name];
  }
}
