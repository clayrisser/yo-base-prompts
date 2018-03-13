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
      result.name = await this.namePromt();
    }
    if (!prompts || prompts.destination) {
      result.destination = await this.destinationPrompt(result.name);
    }
    if (!prompts || prompts.description) {
      result.description = await this.descriptionPrompt();
    }
    if (!prompts || prompts.version) {
      result.version = await this.versionPrompt();
    }
    if (!prompts || prompts.license) {
      result.license = await this.licensePrompt();
    }
    if (!prompts || prompts.authorName) {
      result.authorName = await this.authorNamePrompt();
    }
    if (!prompts || prompts.authorEmail) {
      result.authorEmail = await this.authorEmailPrompt();
    }
    if (!prompts || prompts.githubUsername) {
      result.githubUsername = await this.githubUsernamePrompt(result.email);
    }
    if (!prompts || prompts.authorUrl) {
      result.authorUrl = await this.authorUrlPrompt(result.githubUsername);
    }
    if (!prompts || prompts.repository) {
      result.repository = await this.repositoryPrompt(
        result.githubUsername,
        result.name
      );
    }
    if (!prompts || prompts.homepage) {
      result.homepage = await this.homepagePrompt(result.repository);
    }
    return result;
  }

  async namePromt() {
    return this.optionOrPrompt({
      type: 'input',
      name: 'name',
      message: 'Project Name:',
      default: guessProjectName()
    });
  }

  async destinationPrompt(name) {
    return this.optionOrPrompt({
      type: 'input',
      name: 'destination',
      message: 'Destination:',
      default: guessProjectDestination(name)
    });
  }

  async descriptionPrompt() {
    return this.optionOrPrompt({
      type: 'input',
      name: 'description',
      message: 'Project Description:',
      default: guessProjectDescription()
    });
  }

  async versionPrompt() {
    return this.optionOrPrompt({
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: guessProjectVersion()
    });
  }

  async licensePrompt() {
    return this.optionOrPrompt({
      type: 'input',
      name: 'license',
      message: 'License:',
      default: 'MIT'
    });
  }

  async authorNamePrompt() {
    return this.optionOrPrompt({
      type: 'input',
      name: 'authorName',
      message: 'Author Name:',
      default: guessAuthorName()
    });
  }

  async authorEmailPrompt() {
    return this.optionOrPrompt({
      type: 'input',
      name: 'authorEmail',
      message: 'Author Email:',
      default: guessAuthorEmail()
    });
  }

  async githubUsernamePrompt(authorEmail) {
    return this.optionOrPrompt({
      type: 'input',
      name: 'githubUsername',
      message: 'GitHub Username:',
      default: guessUsername(authorEmail)
    });
  }

  async authorUrlPrompt(githubUsername) {
    return this.optionOrPrompt({
      type: 'input',
      name: 'authorUrl',
      message: 'Author URL:',
      default: `https://${githubUsername}.com`
    });
  }

  async repositoryPrompt(githubUsername, name) {
    return this.optionOrPrompt({
      type: 'input',
      name: 'repository',
      message: 'Repository:',
      default: `https://github.com/${githubUsername}/${name}`
    });
  }

  async homepagePrompt(repository) {
    return this.optionOrPrompt({
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