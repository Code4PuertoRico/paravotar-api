# Code 4 Puerto Rico Repositorio Base

Repositorio base para todo proyecto en Code 4 Puerto Rico.

> [!IMPORTANT]
> El desarrollow y mantenimiento de este repository a sido transferido a la organización [Para-Votar](https://github.com/Para-Votar).
> Este repositorio sera archivado y se mantendra accesible. Para cualquier pregunta y colaboración por favor vaya a
> - [Para Votar API Issues](https://github.com/Para-Votar/paravotar-api/issues)
> - [Para Votar API Discussions](https://github.com/Para-Votar/paravotar-api/discussions)

## Como utilizar esto

Haga click en el boton de `Use this template`.

![Imgur: https://imgur.com/FeDfjCd](https://i.imgur.com/FeDfjCd.png?1)

Una vez acabe el proceso de crear tu repositorio debería añadir o cambiar algunas cosas:

1. Cambiar `code_owner` en los workflow files encontrados en directorio [.github/workflows](.github/workflows)
2. Cambiar el valor del `cron` en el workflow [.github/workflows/stale.yml](.github/workflows/stale.yml#L6). Esto determina cuando este workflow se ejecuta. Este valor sigue el formato de `cron`. Para más información sobre esto
    - [Wikipedia Cron](https://en.wikipedia.org/wiki/Cron)
    - [Crontab Guru](https://crontab.guru/)
3. Revisar y cambiar, de ser necesario, el archivo [CONTRIBUTING.md](CONTRIBUTING.md) a algo que haga sentido para tu proyecto.
4. Recomendamos que utilizen ["Issue Templates" y "Pull Request Templates"](https://help.github.com/en/github/building-a-strong-community/using-templates-to-encourage-useful-issues-and-pull-requests).
5. Cambiar la licencia del proyecto a una [licencia de código abierto](https://opensource.org/licenses).
    - Tambien puedes utilizar [Choose a License](https://choosealicense.com/).
    - [Más información sobre licencias en repositorios en GitHub](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository#where-does-the-license-live-on-my-repository)
6. Cambiar o eliminar los `code owners` encontrados en [.github/CODEOWNERS](.github/CODEOWNERS#L5) a los usuarios pertinentes para el repositorio que se esta creando.
    - [Más información sobre CODEOWNERS](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners)
7. Dependiendo del proyecto es recomendable [crear "branch protections" en tu repositorio](https://help.github.com/en/github/administering-a-repository/configuring-protected-branches).


## Codigo de Conducta

Todo proyecto en Code 4 Puerto Rico tiene que dejarse llevar por su codigo de conducta. De esto no ser posible se deberia discutir con Code 4 Puerto Rico.

Si estas usando este "template" para un proyecto fuera de Code 4 Puerto Rico les recomendamos utilizar un código de conducta mencionado [aquí](https://opensource.guide/code-of-conduct/).
