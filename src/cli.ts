import yargs from 'yargs'
import { AnyFileSystem, GoogleCloudFileSystem, LocalFileSystem, S3FileSystem } from './index'

async function main() {
  const fs = new AnyFileSystem([
    { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: '', fs: new LocalFileSystem() },
  ])

  await yargs
    .strict()
    .options({
      verbose: { type: 'boolean' },
    })
    .help()
    .command(
      'cat <path>',
      'output contents of file',
      () => {
        /* */
      },
      async (args: Record<string, any>) => {
        const stream = await fs.openReadableFile(args.path)
        await new Promise<void>((resolve, reject) => {
          stream
            .finish((err) => {
              if (err) reject(err)
              else resolve()
            })
            .pipe(process.stdout)
        })
      }
    )
    .command(
      'cp <source> <target>',
      'copy source file to target',
      () => {
        /* */
      },
      async (args: Record<string, any>) => {
        const input = await fs.openReadableFile(args.source)
        const output = await fs.openWritableFile(args.target)
        await new Promise<void>((resolve, reject) => {
          output.finish((err) => {
            if (err) reject(err)
            else resolve()
          }, input.finish())
        })
      }
    )
    .command(
      'ls <path> [prefix]',
      'list files',
      () => {
        /* */
      },
      async (args: Record<string, any>) => {
        const res = await fs.readDirectory(args.path, args.prefix)
        console.log(res)
      }
    )
    .command(
      'rm <path>',
      'remove file',
      () => {
        /* */
      },
      async (args: Record<string, any>) => {
        const res = await fs.removeFile(args.path)
        console.log(res)
      }
    )
    .command(
      'stat <path>',
      'get file status',
      () => {
        /* */
      },
      async (args: Record<string, any>) => {
        const res = await fs.getFileStatus(args.path)
        console.log(res)
      }
    )
    .command(
      'write <path>',
      'write stdin to output file',
      () => {
        /* */
      },
      async (args: Record<string, any>) => {
        const stream = await fs.openWritableFile(args.path)
        await new Promise<void>((resolve, reject) => {
          stream.finish((err) => {
            if (err) reject(err)
            else resolve()
          }, process.stdin)
        })
      }
    ).argv
}

/* tslint:disable-next-line */
main()
