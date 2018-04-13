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
      this.destination = result.destination = await this.destinationPrompt();
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
      this.githubUsername = result.githubUsername = await this.githubUsernamePrompt();
    }
    if (!prompts || prompts.authorUrl) {
      this.authorUrl = result.authorUrl = await this.authorUrlPrompt();
    }
    if (!prompts || prompts.repository) {
      this.repository = result.repository = await this.repositoryPrompt();
    }
    if (!prompts || prompts.homepage) {
      this.homepage = result.homepage = await this.homepagePrompt();
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

  async destinationPrompt() {
    if (!this.name) this.name = await this.namePromt();
    const destination = await this.yo.optionOrPrompt({
      type: 'input',
      name: 'destination',
      message: 'Destination:',
      default: guessProjectDestination(this.name)
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

  async githubUsernamePrompt() {
    if (!this.authorEmail) this.authorEmail = await this.authorEmailPrompt();
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'githubUsername',
      message: 'GitHub Username:',
      default: guessUsername(this.authorEmail)
    });
  }

  async authorUrlPrompt() {
    if (!this.githubUsername)
      this.githubUsername = await this.githubUsernamePrompt();
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'authorUrl',
      message: 'Author URL:',
      default: `https://${this.githubUsername}.com`
    });
  }

  async repositoryPrompt() {
    if (!this.githubUsername)
      this.githubUsername = await this.githubUsernamePrompt();
    if (!this.name) this.name = await this.namePromt();
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'repository',
      message: 'Repository:',
      default: `https://github.com/${this.githubUsername}/${this.name}`
    });
  }

  async homepagePrompt() {
    if (!this.repository) this.repository = await this.repositoryPrompt();
    return this.yo.optionOrPrompt({
      type: 'input',
      name: 'homepage',
      message: 'Homepage:',
      default: this.repository
    });
  }
}
