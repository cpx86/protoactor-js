import { IActor, fromProducer, spawn } from "../src/actor";
import { OneForOneStrategy, IDecider, SupervisorDirective } from "../src/supervision";
import * as messages from "../src/messages";
import { LocalContext } from "../src/localContext";

class Hello {
    constructor(public Who: string) {

    }
}
class Recoverable { }
class Fatal { }
class ParentActor implements IActor {
    ToShortString(): string {
        throw new Error("Method not implemented.");
    }
    Tell(message: messages.Message): void {
        throw new Error("Method not implemented." + message);
    }
    Receive(ctx: LocalContext) {
        var child
        if (!ctx.Children || ctx.Children.length == 0) {
            let props = fromProducer(() => new ChildActor())
            child = ctx.Spawn(props)
        } else {
            child = ctx.Children[0]
        }
        let msg = ctx.Message
        if (msg instanceof Hello) {
            child.Tell(msg)
        }
        if (msg instanceof Recoverable) {
            child.Tell(msg)
        }
        if (msg instanceof Fatal) {
            child.Tell(msg)
        }
    }
}
class ChildActor implements IActor {
    ToShortString(): string {
        throw new Error("Method not implemented.");
    }
    Tell(message: messages.Message): void {
        throw new Error("Method not implemented." + message);
    }
    Receive(ctx: LocalContext) {
        let msg = ctx.Message
        if (msg instanceof Hello) {
            console.log(ctx.Self.ToShortString(), 'Hello', msg.Who)
        }
        if (msg instanceof Recoverable) {
            console.log(ctx.Self.ToShortString(), 'Recoverable')
            throw msg
        }
        if (msg instanceof Fatal) {
            console.log(ctx.Self.ToShortString(), 'Fatal')
            throw msg
        }
        if (msg == messages.Started) {
            console.log(ctx.Self.ToShortString(), 'Started')
        }
        if (msg == messages.Stopping) {
            console.log(ctx.Self.ToShortString(), 'Stopping')
        }
        if (msg == messages.Stopped) {
            console.log(ctx.Self.ToShortString(), 'Stopped')
        }
        if (msg == messages.Stopping) {
            console.log(ctx.Self.ToShortString(), 'Stopping')
        }
        if (msg == messages.Restarting) {
            console.log(ctx.Self.ToShortString(), 'Restarting')
        }
    }
}

var decider: IDecider = (who, reason) => {
    if (reason instanceof Recoverable)
        return SupervisorDirective.Restart;
    if (reason instanceof Fatal)
        return SupervisorDirective.Stop;
    return SupervisorDirective.Escalate;
}
var props = fromProducer(() => new ParentActor())
    .WithSupervisor(new OneForOneStrategy(decider, 1));

var pid = spawn(props)

pid.Tell(new Hello("Christian"))

pid.Tell(new Recoverable())
pid.Tell(new Fatal())