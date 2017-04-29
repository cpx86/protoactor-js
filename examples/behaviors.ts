import * as actor from "../src/actor";
import {LocalContext} from "../src/localContext";

class Hello {
    constructor(public Who: string) {
        
    }
}

let helloBehavior = (context: LocalContext) => {
    var msg = context.Message
    if (msg instanceof Hello) {
        console.log('Hello', msg.Who)
        console.log('changing to goodbye behavior')
        context.PushBehavior(goodbyeBehavior)
    }
}
let goodbyeBehavior = (context: LocalContext) => {
    var msg = context.Message
    if (msg instanceof Hello) {
        console.log('I already said hello. Goodbye', msg.Who)
        console.log('reverting to previous behavior')
        context.PopBehavior()
    }
}

var props = actor.fromFunc(helloBehavior)
var pid = actor.spawn(props)

pid.Tell(new Hello("Christian"))
pid.Tell(new Hello("Christian"))
pid.Tell(new Hello("Christian"))
