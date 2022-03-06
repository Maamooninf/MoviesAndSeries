// var io = req.app.get('socketio');
import express from "express";
import cors from "cors";
import { globaly } from "../interfaces/main";
import { Server } from "socket.io";
import mongoose from "mongoose";
class App {
  public app: express.Application;
  public port: number;
  public io: Server;
  public onlineusers: any[];

  constructor(controllers: any, port: number) {
    this.app = express();
    this.io = new Server({
      cors: {
        origin: "http://localhost:3000",
      },
    });
    this.port = port;
    this.onlineusers = [];

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    mongoose.set("runValidators", true);
    mongoose
      .connect("mongodb://localhost/Webflex")
      .then(() => {
        console.log("conntected");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private initializeMiddlewares() {
    this.app.set("socketio", this.io);
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeControllers(controllers: globaly[]) {
    controllers.forEach((controller: globaly) => {
      this.app.use(controller.path, controller.router);
    });
  }

  public listen() {
    this.io.listen(
      this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`);
      })
    );

    this.io.on("connection", (socket: any) => {
      console.log("some one connected");
      // chat application
      socket.on("NewUser", (id: string) => {
        console.log("new user is " + id);
        const userob = { userId: id, sock: socket.id };
        const check = this.onlineusers.every((use: any) => use.userId !== id);
        if (check) {
          this.onlineusers.push(userob);
          socket.join(id);
        } else {
          this.onlineusers.map((use: any) => {
            if (use.userId === id && use.sock !== socket.id) {
              use.sock = socket.id;
            }
          });
        }
        this.io.emit("OnlineUsers", this.onlineusers);
        console.log(this.onlineusers);
      });

      socket.on("OutUser", (id: string) => {
        this.onlineusers = this.onlineusers.filter(
          (user) => user.userId !== id
        );
        socket.leave(id);
        this.io.emit("OnlineUsers", this.onlineusers);
      });

      socket.on("disconnect", () => {
        this.onlineusers = this.onlineusers.filter(
          (user) => user.sock !== socket.id
        );
        console.log(this.onlineusers);
        this.io.emit("OnlineUsers", this.onlineusers);
      });
    });
  }
}

export default App;
