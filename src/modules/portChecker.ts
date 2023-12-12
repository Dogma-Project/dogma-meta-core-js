import net from "node:net";

export default async function CheckPort(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once("error", (err: any) => {
      s.close();
      if (err.code == "EADDRINUSE") {
        resolve(false);
      } else {
        reject(err);
      }
    });
    s.once("listening", () => {
      s.close();
      resolve(true);
    });
    s.listen(port);
  });
}
