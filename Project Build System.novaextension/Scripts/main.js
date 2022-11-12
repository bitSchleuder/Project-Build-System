
exports.activate = function() {
    // Do work when the extension is activated
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}


class TaskProvider {
    constructor() {
        
    }
    
    provideTasks() {
        let task = new Task("Say Example");
        
        task.setAction(Task.Build, new TaskProcessAction('/usr/bin/say', {
            args: ["I'm Building!"],
            env: {}
        }));
        
        task.setAction(Task.Run, new TaskProcessAction('/usr/bin/say', {
            args: ["I'm Running!"],
            env: {}
        }));
        
        task.setAction(Task.Clean, new TaskProcessAction('/usr/bin/say', {
            args: ["I'm Cleaning!"],
            env: {}
        }));
        
        return [task];
    }
}


nova.assistants.registerTaskAssistant(new TaskProvider(), {
    identifier: "example-tasks",
    name: "Examples"
});

