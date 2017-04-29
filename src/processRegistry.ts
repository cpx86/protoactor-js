import { PID } from "./pid";
import { IProcess } from "./process";

export class ProcessRegistry {
    private localActorRefs: { [Id: string]: any } = {};
    private counter = 0;

    Get(pid: PID) {
        return this.localActorRefs[pid.Id]
    }

    TryAdd(id: string, ref: IProcess, pidCtor: new (adress: string, id: string, ref: IProcess) => PID) {
        var pid = new pidCtor("local", id, ref);
        this.localActorRefs[pid.Id] = ref;
        return pid;
    }

    NextId() {
        return "$" + this.counter++
    }

    Remove(pid: PID) {
        this.localActorRefs[pid.Id] = undefined
    }
}
const processRegistry = new ProcessRegistry();

export default processRegistry;
