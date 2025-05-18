#!/usr/bin/env node
import cac from 'cac'
import chalk from 'chalk'
import prompts from 'prompts'
import readline from 'readline'

const cli = cac('@inkart/cli')

const defaultName = 'my-projectName'
cli.command('create [projectName]', 'create new template').action(async (projectName: string, options: any) => {
    console.log('你是：', projectName)
    projectName = await resolveProjectName(projectName)
    const template = await selectProjectTemplate()
    console.log(projectName, template)
})

/**
 * @name resolveProjectName
 * @param projectName 
 * @returns Promise<string>
 * 
 * @description get project name
 */
function resolveProjectName(projectName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            if (projectName != undefined) {
                return resolve(projectName)
            }

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            rl.question(chalk.cyan('🍔 Please enter project name: ') + chalk.gray(`${defaultName}`),  (input: string) => {
                projectName = input.trim() ?? defaultName
                rl.close()
                resolve(projectName)
            })
        } catch (error) {
            reject(error)
        }

    })
}

/**
 * @name selectProjectTemplate
 * @returns Promise<string>
 * 
 * @description selected project template
 */
function selectProjectTemplate(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const { template } = await prompts({
                type: 'select',
                name: 'template',
                message: chalk.cyan('🍟 Please select the project template'),
                hint: `- choose: ⬆ + ⬇; Enter: selected.`,
                choices: [{
                    title: 'Monorepo',
                    value: 'monorepo'
                }],
                initial: 0
            })

            resolve(template)
        } catch (error) {
            reject(error)
        }
    })
}

cli.version('v1.0.0')
cli.help()
cli.parse()