declare module "generate-google-calendar-url";
declare module "first-provide-some-config" {
  export default function config(
    key: string,
    message: string,
  ): Promise<string>;
}