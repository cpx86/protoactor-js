import * as messages from './messages';
import { Dispatcher } from './dispatcher';
import { DefaultStrategy, IStrategy } from './supervision';
import processRegistry from './processRegistry';
import { LocalContext } from './localContext';
import { LocalProcess } from './localProcess';
import {Unbounded, Mailbox} from "./mailbox";
import { PID } from './pid';
import { IActor } from "./actor";
export interface ISpawner {
    (props: Props, name: string, parent?: PID): PID;
}
export class Props {
    mailboxProducer = (): Mailbox => Unbounded();
    dispatcher = new Dispatcher();
    supervisorStrategy: IStrategy = DefaultStrategy;
    spawner: ISpawner = Props.DefaultSpawner;
    producer: () => IActor;
    WithProducer(producer: () => IActor) {
        this.producer = producer
        return this
    }

    WithDispatcher(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher
        return this
    }

    WithSupervisor(supervisor: IStrategy) {
        this.supervisorStrategy = supervisor
        return this
    }

    WithSpawner(spawner: ISpawner) {
        this.spawner = spawner
        return this
    }

    Spawn(name: string, parent?: PID) {
        return this.spawner(this, name, parent)
    }

    static DefaultSpawner(props: Props, name: string, parent?: PID) {
        var context = new LocalContext(props.producer, props.supervisorStrategy, parent)
        var mailbox = props.mailboxProducer()
        var dispatcher = props.dispatcher
        var ref = new LocalProcess(mailbox)
        var pid = processRegistry.TryAdd(name, ref, PID)
        context.Self = pid
        mailbox.RegisterHandlers(context, dispatcher)
        mailbox.PostSystemMessage(messages.Started)
        mailbox.Start()
        return pid
    }
}