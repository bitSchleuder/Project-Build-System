import { BuildTask } from "./BuildTask";

export class BuildModule {
  buildConfigFilePath = "";
  buildConfigFile = "";
  buildTasks = [];
  buildExec = "";
  buildExecPattern = "";

  constructor(_buildExecPattern) {
    this.buildExecPattern = _buildExecPattern;
  }

  getAvailableExec() {
    var result = [];
    if (this.buildExecPattern) {
      var process = new Process("/usr/bin/locate", [this.buildExecPattern]);

      process.onDidExit(function (line) {
        result.push(line);
      });
    }
    return result;
  }

  provideTasks() {
    var tasks = [];

    let buildTasks = this.#readBuildTasks();

    buildTasks.forEach((currentTask) => {
      let task = new Task(currentTask.entry);

      task.setAction(
        Task.Run,
        new TaskProcessAction(this.buildExec, {
          args: ["run", currentTask.command],
          env: {},
          shell: true,
        })
      );
    });

    return tasks;
  }

  #readBuildTasks() {
    var buildTasks = [];

    var jsonFile = this.#readBuildFile(this.buildConfigFilePath);

    if (jsonFile.hasOwnProperty("scripts")) {
      buildTasks = this.#getScriptTasks(jsonFile.scripts);
    }

    return buildTasks;
  }

  #readBuildFile(_path) {
    var result = "";
    var buildFileStat = nova.fs.stat(_path);

    if (buildFileStat && buildFileStat.isFile()) {
      var buildFile = nova.fs.open(_path).read();
      result = JSON.parse(buildFile);
    }

    return result;
  }

  #getScriptTasks(_scriptsObejct) {
    var buildTasks = [];
    Object.entries(_scriptsObejct).forEach(([key, value]) => {
      buildTasks.push(new BuildTask(key, value));
    });
    return buildTasks;
  }

  runTask(_taskAsString) {
    var result = [[], [], []];
    if (this.buildExec) {
      var process = new Process(this.buildExec, [_taskAsString]);

      process.onStdout(function (line) {
        result[0].push(line);
      });

      process.onStderr(function (line) {
        result[1].push(line);
      });

      process.onDidExit(function (line) {
        result[2].push(line);
      });
    }

    return result;
  }
}
