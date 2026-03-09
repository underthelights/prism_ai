window.PAGE_DOCS = {
  home: {
    title: 'Home',
    subtitle: 'Robot type selection and pipeline entry',
    purpose: 'Use Home to establish the robot context for the current session, verify that the PRISM backend is alive, and move into the correct working page without mixing robot-specific state.',
    accessRule: 'Always open Home first when starting a new browser session.',
    bestFor: 'Session startup, robot selection, first-time operator orientation',
    runtimeMode: 'Entry and navigation hub',
    audience: ['Field operator', 'Demo operator', 'New user', 'Robot setup engineer'],
    prerequisites: [
      'The PRISM web UI must already be reachable from your browser.',
      'The rosbridge-backed backend must be running, otherwise the heartbeat badge will not stabilize.',
      'You should know which robot hardware you are connected to before selecting a robot type.'
    ],
    features: [
      'Shows the heartbeat badge so you can confirm that the web UI is talking to the backend.',
      'Lets you select the active robot type before entering downstream pages.',
      'Displays the high-level workflow cards for Record, Augment, Train, and Inference.',
      'Prevents accidental entry into downstream screens without a valid robot context.'
    ],
    services: ['setRobotType', 'getRobotTypeList'],
    topics: ['/task/status'],
    inputs: ['Robot type selection', 'Navigation action to the next working page'],
    outputs: ['Session robot context', 'Connected or blocked navigation state'],
    relatedPages: ['Devices for pre-flight hardware inspection', 'Record for data capture', 'Training for model fitting', 'Inference for policy execution'],
    artifacts: ['Redux session state for selected robot type'],
    tech: {
      component: 'physical_ai_manager/src/pages/HomePage.js',
      redux: 'tasks.taskStatus, ui.currentPage',
      dependencies: 'RobotTypeSelector, HeartbeatStatus, buildInfo.json',
      navigation: 'moveToPage(PageType.DEVICES)'
    },
    userFlow: [
      'Open the web UI and wait until heartbeat and backend state settle.',
      'Select the correct robot type for the connected hardware.',
      'Use Launch PRISM to move into Devices, or choose a workflow card after the session context is known.',
      'If the wrong robot was selected, return here before touching Record, Training, or Inference.'
    ],
    expectedResult: ['Every later page runs under the correct robot context and the operator can move through the PRISM workflow without configuration drift.'],
    userTips: ['The selected robot type affects later defaults such as frame names, URDF model, and task behavior. Treat it as a session-level setting, not a cosmetic choice.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Before opening Home</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Open the PRISM web UI</span>
            <span class="step-detail">Use the deployment address provided for your robot worker. In many field setups this is an mDNS-style host such as <code>http://ffw-{serial-number}.local</code>. If that is not available, use the robot PC IP address instead.</span>
          </li>
          <li>
            <span class="step-title">Wait for the initial backend state</span>
            <span class="step-detail">The Home page is useful only after the browser can talk to the backend. If the heartbeat indicator stays disconnected, do not proceed to Record, Training, or Inference yet.</span>
          </li>
          <li>
            <span class="step-title">Identify the actual hardware you are controlling</span>
            <span class="step-detail">Confirm the robot family before touching the selector. Downstream pages assume the Home-page robot type is correct.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>What the Home page contains</h3>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Heartbeat area</h4>
            <p>Shows whether the web UI is connected to the backend runtime. Treat this as the first health signal before running anything else.</p>
          </article>
          <article class="mini-card">
            <h4>Robot selector</h4>
            <p>Defines the active robot context for the browser session. This is the most important control on the page.</p>
          </article>
          <article class="mini-card">
            <h4>Launch button</h4>
            <p>Takes you to <code>Devices</code> once a valid robot is selected. If no robot type is selected, PRISM blocks the action.</p>
          </article>
          <article class="mini-card">
            <h4>Workflow cards</h4>
            <p>Summarize the major operating loop: Record, Augment, Train, and Inference.</p>
          </article>
        </div>
      </div>
      <div class="doc-block">
        <h3>Step-by-step use</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Verify connection status</span>
            <span class="step-detail">Check the heartbeat panel first. If the UI still looks disconnected, fix networking or backend startup before continuing.</span>
          </li>
          <li>
            <span class="step-title">Select the robot type</span>
            <span class="step-detail">Choose the exact robot hardware in the selector. This drives later URDF loading, frame-name defaults, and runtime validation.</span>
          </li>
          <li>
            <span class="step-title">Launch into the workflow</span>
            <span class="step-detail">Use the main launch button to enter the pipeline through <code>Devices</code>. That page is the recommended pre-flight stop before operating the robot.</span>
          </li>
          <li>
            <span class="step-title">Use workflow cards for orientation</span>
            <span class="step-detail">The cards do not replace the left sidebar. They are there to help operators understand which stage they should enter next.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Common mistakes</h3>
        <ul>
          <li>Opening Record or Inference immediately without confirming the correct robot type.</li>
          <li>Ignoring the heartbeat state and assuming the backend is healthy because the page loaded.</li>
          <li>Leaving the browser on an old session after the hardware target changed.</li>
        </ul>
      </div>
    `
  },
  devices: {
    title: 'Devices',
    subtitle: 'Robot and camera pre-flight inspection',
    purpose: 'Use Devices to confirm that the selected robot, URDF model, and connected cameras match reality before you start recording or inference.',
    accessRule: 'Open after Home and before Record or Inference.',
    bestFor: 'Hardware readiness checks and model sanity checks',
    runtimeMode: 'Inspection and validation',
    audience: ['Hardware setup engineer', 'Operator before a live session', 'On-site maintenance owner'],
    prerequisites: [
      'A robot type must already be selected on Home.',
      'The robot description package and camera stack should already be running in the backend environment.',
      'If you expect live joint motion in the URDF viewer, joint-state publishing must be healthy.'
    ],
    features: [
      'Displays the robot structure and specifications hard-coded for each supported robot family.',
      'Loads camera configuration through the ROS service hook and shows camera devices.',
      'Renders a URDF-based 3D viewer for visual cross-checks.',
      'Lets you click joints and inspect the kinematic tree more precisely.'
    ],
    services: ['/camera/get_config'],
    topics: ['/joint_states'],
    inputs: ['Currently selected robot type', 'Camera config response', 'Joint highlight selection'],
    outputs: ['Camera readiness summary', 'Visual confirmation that the robot model matches the real hardware'],
    relatedPages: ['Home selects the robot type used here', 'Record and Inference depend on the same hardware assumptions'],
    tech: {
      component: 'physical_ai_manager/src/pages/DevicesPage.js',
      serviceHook: 'useRosServiceCaller().getCameraConfig',
      viewer: 'URDFViewer lazy-loaded with joint highlight state',
      dataFlow: 'robot spec table + camera config -> visual cards and tree'
    },
    userFlow: [
      'Open Devices after selecting the robot on Home.',
      'Check the camera list and compare it with the expected hardware layout.',
      'Confirm that the URDF model loads and joint grouping looks correct.',
      'Proceed to Record or Inference only after the mismatch risk is gone.'
    ],
    expectedResult: ['The operator confirms that the connected cameras and robot model are correct before moving into higher-risk pages.'],
    userTips: ['If Devices looks wrong, fix the mismatch here. Do not try to compensate later on Record or Inference.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Why this page matters</h3>
        <p>Devices is the last low-risk place to catch basic setup errors. If the wrong robot type was chosen, the wrong camera stack is running, or the URDF does not line up with reality, you want to discover it here rather than while recording a dataset or commanding a live policy.</p>
      </div>
      <div class="doc-block">
        <h3>Recommended pre-flight routine</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Confirm the robot name shown by PRISM</span>
            <span class="step-detail">The page uses the Home-page robot selection. If the displayed robot family is wrong, return to Home immediately and correct it.</span>
          </li>
          <li>
            <span class="step-title">Inspect the camera device cards</span>
            <span class="step-detail">Compare detected camera names, models, and positions with the real setup. This is especially important for wrist, top, and third-person RGB-D camera layouts.</span>
          </li>
          <li>
            <span class="step-title">Check that the URDF model renders</span>
            <span class="step-detail">A healthy render tells you that the page can load the robot description. It also helps catch obvious robot-family mismatches.</span>
          </li>
          <li>
            <span class="step-title">Use joint highlighting if something looks inconsistent</span>
            <span class="step-detail">Click joints to inspect arm groups, gripper joints, and base or body joints. This is useful when the naming looks unfamiliar or when verifying a newly-added platform.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>When to stop and fix the setup</h3>
        <div class="note-list">
          <article class="note-card">
            <strong>Camera config is empty</strong>
            <p>Do not proceed. Check whether the camera configuration service is alive and whether the camera nodes actually started.</p>
          </article>
          <article class="note-card">
            <strong>URDF does not match the real robot</strong>
            <p>Go back to Home and verify the robot type. If Home is correct, then inspect the robot description package or deployment configuration.</p>
          </article>
          <article class="note-card">
            <strong>Expected camera is missing</strong>
            <p>Record and Inference will likely behave badly later. Fix the device layer or launch stack first.</p>
          </article>
        </div>
      </div>
    `
  },
  record: {
    title: 'Record',
    subtitle: 'Dataset preparation and recording',
    purpose: 'Use Record to capture demonstrations on real hardware, control episode timing, annotate outcome quality, and optionally push the result into downstream dataset workflows.',
    accessRule: 'Blocked until a robot type is selected on Home.',
    bestFor: 'Teleoperation data collection and episode-level labeling',
    runtimeMode: 'Live data capture',
    audience: ['Data collection operator', 'Task owner', 'Field demo recorder'],
    prerequisites: [
      'Open Home first and select the correct robot type.',
      'Use Devices to verify that the cameras and robot model are healthy before recording.',
      'If you plan to upload immediately, ensure the AI Worker has network access and valid Hugging Face credentials.',
      'If rosbag recording is enabled, confirm that enough storage is available because rosbag data is much larger than the LeRobot dataset alone.'
    ],
    features: [
      'Shows multiple live camera streams while recording is running.',
      'Controls warm-up, recording, reset, stop, retry, next, and finish actions.',
      'Captures episode success and failure labels and stores them with the dataset workflow.',
      'Supports automatic success-only annotation as well as manual failure review.'
    ],
    services: ['/task/command'],
    topics: ['/task/status', '/task/info'],
    inputs: ['Task configuration', 'Episode timing values', 'Success or failure annotation', 'Operator recording commands'],
    outputs: ['Recorded dataset episodes', 'Episode outcome annotations', 'Optional rosbag artifacts'],
    relatedPages: ['Devices for pre-flight checks', 'Data Tools for quality review', 'Visualize for trajectory inspection', 'Training for turning the dataset into a policy'],
    artifacts: [
      'LeRobot-format dataset under the worker dataset cache path',
      'Optional rosbag episode folders when rosbag recording is enabled',
      'Episode-level success or failure metadata'
    ],
    tech: {
      component: 'physical_ai_manager/src/pages/RecordPage.js',
      serviceHook: 'useRosServiceCaller().sendRecordCommand',
      state: 'tasks.taskInfo, tasks.taskStatus, tasks.episodeResult',
      phaseLogic: 'READY, WARMING_UP, RECORDING, RESETTING, SAVING, STOPPED'
    },
    userFlow: [
      'Select the task setup and confirm the live camera feeds.',
      'Start recording and monitor the current phase and episode counters.',
      'Use retry, next, stop, or finish depending on what happened during collection.',
      'Annotate episode quality correctly so later filtering and debugging stay possible.'
    ],
    expectedResult: ['You leave the page with a training-ready demonstration dataset and accurate episode-level metadata.'],
    userTips: ['This page is not only a recorder. It is also the source of ground-truth operational context. Bad annotation discipline here weakens every downstream page.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Dataset Preparation - Recording</h3>
        <p>This page is where real demonstrations are turned into usable training data. Treat the Record page as a controlled operating procedure rather than a simple start button.</p>
      </div>
      <div class="doc-block">
        <h3>Before recording</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Open the web UI</span>
            <span class="step-detail">Access PRISM from your browser using the deployment URL for the robot worker. In some field setups the address is <code>http://ffw-{serial-number}.local</code>. If mDNS is unavailable, use the worker IP address.</span>
          </li>
          <li>
            <span class="step-title">Select the robot type on Home</span>
            <span class="step-detail">Record is blocked until Home has a valid robot selection. If you skip this, PRISM shows a toast and refuses navigation.</span>
          </li>
          <li>
            <span class="step-title">Open Devices and verify hardware</span>
            <span class="step-detail">Check the camera inventory and URDF model before you enter Record. This avoids collecting a dataset under the wrong hardware assumptions.</span>
          </li>
          <li>
            <span class="step-title">Enter the Record page from the sidebar</span>
            <span class="step-detail">Once the robot context is valid, open <code>Record</code> from the left navigation. The page should show live camera streams, task information on the right, and the control panel below.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>Understand the page layout</h3>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Image streaming area</h4>
            <p>Displays wrist, third-person, top, and depth views. Use this area to confirm that the robot and objects are visible before starting an episode.</p>
          </article>
          <article class="mini-card">
            <h4>Task info panel</h4>
            <p>Holds task instruction, timing, task mode, and dataset-related configuration. This panel defines what the recorder will do when you press Start.</p>
          </article>
          <article class="mini-card">
            <h4>Control panel</h4>
            <p>Controls the episode loop and shows the current phase. This is the page section you will interact with most during collection.</p>
          </article>
          <article class="mini-card">
            <h4>Annotation modal</h4>
            <p>Appears at episode completion when manual annotation is needed. Use it to record success or structured failure reasons.</p>
          </article>
        </div>
      </div>
      <div class="doc-block">
        <h3>Configure recording before pressing Start</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Review the camera streams</span>
            <span class="step-detail">Make sure the target workspace is visible and that the active cameras are the ones you expect. If a stream looks wrong, fix the topic selection or backend launch first.</span>
          </li>
          <li>
            <span class="step-title">Set the task information carefully</span>
            <span class="step-detail">Enter task instructions, timing values, episode count, and any single-task or multi-task settings required for this collection run. These values define the semantics of the dataset and are just as important as the images.</span>
          </li>
          <li>
            <span class="step-title">Decide whether to push to the Hub immediately</span>
            <span class="step-detail">If <code>Push to Hub</code> is enabled, the worker needs network access and a valid Hugging Face account path. If network is unstable, disable this option and upload later through CLI or Data Tools.</span>
          </li>
          <li>
            <span class="step-title">Decide whether rosbag capture is required</span>
            <span class="step-detail">If <code>Record Rosbag2</code> is enabled, PRISM stores raw ROS data in addition to the LeRobot dataset. This is useful for debugging and sensor replay, but it consumes substantially more disk space.</span>
          </li>
        </ol>
        <div class="doc-callout info">
          <h3>Rosbag storage note</h3>
          <ul>
            <li>Rosbag episode folders are created under the workspace rosbag directory for the current user.</li>
            <li>Each episode generates its own folder with an <code>.mcap</code> file and metadata.</li>
            <li>Expect rosbag storage to be much larger than the LeRobot dataset alone. Plan disk capacity before a long run.</li>
          </ul>
        </div>
      </div>
      <div class="doc-block">
        <h3>Start recording</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Press Start</span>
            <span class="step-detail">PRISM enters the configured phase loop. Depending on your settings, it warms up, records the episode, resets between episodes, and continues until the planned count or an operator action stops it.</span>
          </li>
          <li>
            <span class="step-title">Monitor the current phase</span>
            <span class="step-detail">The control panel transitions through <code>READY</code>, <code>WARMING_UP</code>, <code>RECORDING</code>, <code>RESETTING</code>, and <code>SAVING</code>. Use this instead of guessing whether the system is already capturing.</span>
          </li>
          <li>
            <span class="step-title">Use the runtime controls intentionally</span>
            <span class="step-detail"><code>Stop</code> saves the current episode and halts the loop. <code>Retry</code> discards the current attempt and re-runs the same episode. <code>Next</code> advances early. <code>Finish</code> closes the session and saves what has been collected so far.</span>
          </li>
          <li>
            <span class="step-title">Annotate the episode result</span>
            <span class="step-detail">If the task is configured for success-only handling, PRISM can auto-submit success. Otherwise, confirm success or failure accurately. This is critical for later filtering, dataset curation, and failure analysis.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>During recording</h3>
        <div class="note-list">
          <article class="note-card">
            <strong>Beep timing cue</strong>
            <p>The operator can use the audible cue at recording start to align motion timing with the episode window.</p>
          </article>
          <article class="note-card">
            <strong>Wearable leader shortcuts</strong>
            <p>In supported setups, the wearable leader buttons can trigger actions such as retry and next without returning to the browser.</p>
          </article>
          <article class="note-card">
            <strong>Phase awareness matters</strong>
            <p>Do not judge a failed demonstration too early. If the system is still in warm-up or reset, the page is not yet collecting data for the next episode.</p>
          </article>
        </div>
      </div>
      <div class="doc-block">
        <h3>After recording</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Wait for saving to complete</span>
            <span class="step-detail">Do not close the page or kill the backend while PRISM is still in <code>SAVING</code>. Let the episode metadata settle first.</span>
          </li>
          <li>
            <span class="step-title">Review the dataset path and upload status</span>
            <span class="step-detail">If Push to Hub was enabled, verify that upload actually happened. If it was disabled, plan your upload or curation workflow manually later.</span>
          </li>
          <li>
            <span class="step-title">Move to the next page based on your goal</span>
            <span class="step-detail">Use <code>Data Tools</code> for quality checks, <code>Visualize</code> for trajectory inspection, <code>Kinematics</code> if you need EEF conversion, and <code>Training</code> once the dataset is ready.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Frequent causes of bad datasets</h3>
        <ul>
          <li>Starting collection before camera views and task instructions were reviewed.</li>
          <li>Using the wrong robot type or wrong camera stack and only noticing after many episodes.</li>
          <li>Marking failed episodes as success to save time.</li>
          <li>Turning on rosbag capture without checking disk space.</li>
        </ul>
      </div>
    `
  },
  training: {
    title: 'Training',
    subtitle: 'Policy training control and monitoring',
    purpose: 'Use Training to configure datasets and checkpoints, launch policy training jobs, watch GPU and progress status, and review previous experiments from one screen.',
    accessRule: 'A valid robot context should already be selected on Home.',
    bestFor: 'Running and monitoring policy training on the worker environment',
    runtimeMode: 'Job configuration and monitoring',
    audience: ['Model trainer', 'Research engineer', 'Experiment owner'],
    prerequisites: [
      'The dataset you intend to train on should already exist and have passed at least a minimal quality review.',
      'GPU resources must be available on the backend side.',
      'You should know whether this run is a fresh run, a resume run, or a restart from previous outputs.'
    ],
    features: [
      'Lets you choose dataset, policy family, output folder, and training options.',
      'Shows live training progress, logs, and dashboard cards.',
      'Fetches GPU status periodically from the backend.',
      'Supports resume workflows and experiment history review.'
    ],
    services: ['/training/command', '/training/get_dataset_list', '/training/get_model_weight_list', '/training/get_training_info', '/system/gpu_status'],
    topics: ['/training/status', '/system/gpu_status'],
    inputs: ['Policy family', 'Dataset path', 'Output directory', 'Hyperparameters and mode'],
    outputs: ['Training checkpoints', 'Progress metrics', 'Experiment history and status records'],
    relatedPages: ['Record or Data Tools prepare the dataset used here', 'Embedding helps compare checkpoints produced here', 'Inference consumes the exported checkpoints'],
    artifacts: ['Training output directory', 'Checkpoint files', 'Experiment history entries'],
    tech: {
      component: 'physical_ai_manager/src/pages/TrainingPage.js',
      statusTopic: '/training/status',
      gpuService: '/system/gpu_status',
      uiComposition: 'ConfigurationPanel + dashboard/history split layout'
    },
    userFlow: [
      'Pick the run mode and dataset.',
      'Set or review policy configuration and output path.',
      'Start training and monitor logs, dashboard metrics, and GPU load.',
      'Review history and decide whether to resume, stop, or export.'
    ],
    expectedResult: ['You get reproducible training runs and usable checkpoint outputs without leaving the PRISM UI.'],
    userTips: ['GPU availability can look healthy while the actual job still fails later due to VRAM spikes. Watch both the training logs and the GPU panel.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Understand the layout</h3>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Left configuration panel</h4>
            <p>Dataset selection, policy selection, output path, training options, and resume-specific controls live here.</p>
          </article>
          <article class="mini-card">
            <h4>Main monitoring area</h4>
            <p>Shows either the live dashboard for the current run or the experiment history panel when you toggle history.</p>
          </article>
          <article class="mini-card">
            <h4>GPU status refresh</h4>
            <p>The page polls the backend every few seconds to show current GPU availability and state.</p>
          </article>
          <article class="mini-card">
            <h4>CLI guide</h4>
            <p>Includes example training commands for operators who still need a terminal-side fallback or want to compare UI options with CLI behavior.</p>
          </article>
        </div>
      </div>
      <div class="doc-block">
        <h3>Typical training procedure</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Decide the run mode first</span>
            <span class="step-detail">Choose whether this is a fresh run or a resume run. Resume mode changes which controls are editable and which previous outputs are loaded.</span>
          </li>
          <li>
            <span class="step-title">Select the dataset</span>
            <span class="step-detail">Pick the dataset that already matches the robot, observation schema, and task family. Do not assume a visually similar dataset is compatible.</span>
          </li>
          <li>
            <span class="step-title">Select the policy family</span>
            <span class="step-detail">Different policy types expose different expectations for batch size, sequence length, and checkpoint behavior. Validate the policy family before touching the rest of the options.</span>
          </li>
          <li>
            <span class="step-title">Set the output folder</span>
            <span class="step-detail">Use a clear, non-colliding output path so that history review and future resume actions stay obvious.</span>
          </li>
          <li>
            <span class="step-title">Review hyperparameters against available GPU memory</span>
            <span class="step-detail">Batch size, accumulation, and image-heavy policy settings must fit the current GPU state. The page helps, but the final responsibility is still yours.</span>
          </li>
          <li>
            <span class="step-title">Start the run and monitor status</span>
            <span class="step-detail">Use the dashboard, status topic, and logs together. Do not rely on only one signal when deciding whether a run is healthy.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>How to use the monitoring side correctly</h3>
        <div class="note-list">
          <article class="note-card">
            <strong>Dashboard</strong>
            <p>Use it for quick progress, status, and high-level health checks during the active run.</p>
          </article>
          <article class="note-card">
            <strong>History</strong>
            <p>Switch here when you need to compare a current run with previous experiments, select a resume source, or audit output folders.</p>
          </article>
          <article class="note-card">
            <strong>GPU list</strong>
            <p>Use it to catch obvious resource contention early, especially on shared training machines.</p>
          </article>
        </div>
      </div>
      <div class="doc-callout warn">
        <h3>What usually breaks training runs</h3>
        <ul>
          <li>Dataset schema mismatch with the selected policy family.</li>
          <li>Resuming from the wrong output directory.</li>
          <li>Choosing aggressive batch settings without enough VRAM headroom.</li>
          <li>Ignoring early warning signs in logs because the dashboard still looks active.</li>
        </ul>
      </div>
    `
  },
  inference: {
    title: 'Inference',
    subtitle: 'Policy loading and live runtime execution',
    purpose: 'Use Inference to load a trained policy, observe the live camera feeds, watch runtime logs and loading state, and operate the robot under policy control in a controlled way.',
    accessRule: 'Blocked until Home has a valid robot type.',
    bestFor: 'On-hardware policy validation',
    runtimeMode: 'Live deployment and monitoring',
    audience: ['Robot operator', 'Policy validation owner', 'Demo engineer'],
    prerequisites: [
      'Use Devices to verify hardware first.',
      'Choose a checkpoint that actually matches the current robot type and observation setup.',
      'Confirm that the robot workspace is safe before loading or starting policy execution.'
    ],
    features: [
      'Shows live camera feeds in a 2x2 grid.',
      'Provides right-panel runtime controls, logs, and joint-state visualization.',
      'Supports depth overlay toggle on the third camera panel.',
      'Keeps runtime panels mounted for fast mode switching and stable rendering.'
    ],
    services: ['/task/command'],
    topics: ['/task/status', '/inference/loading_status', '/joint_states'],
    inputs: ['Policy path and inference controls', 'Task context', 'Start and stop commands'],
    outputs: ['Live robot runtime state', 'Loading progress', 'Operator-visible execution traces'],
    relatedPages: ['Training produces the checkpoints used here', 'Human Override complements this page during live operation'],
    tech: {
      component: 'physical_ai_manager/src/pages/InferencePage.js',
      uiLayout: 'camera grid + right-side runtime panel',
      viewer: 'JointStatesGraph and URDFViewer',
      state: 'tasks.taskStatus, tasks.taskInfo, jointStates'
    },
    userFlow: [
      'Verify the target policy and robot match.',
      'Watch the loading pipeline until the model is fully ready.',
      'Observe the robot and camera grid continuously while inference is running.',
      'Stop immediately if motion quality or safety is not acceptable.'
    ],
    expectedResult: ['You can validate a trained policy on real hardware while preserving operator visibility into what the runtime is doing.'],
    userTips: ['The page is useful only when the operator is willing to stop early. Treat Stop as a normal control, not a failure condition.'],
    guideHtml: `
      <div class="doc-block">
        <h3>What this page is for</h3>
        <p>Inference is where a trained policy meets the real robot. The page is designed to keep the operator’s situational awareness high: camera feeds on the left, runtime state and controls on the right, and joint or model context where needed.</p>
      </div>
      <div class="doc-block">
        <h3>Step-by-step deployment flow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Open the page only after hardware checks are complete</span>
            <span class="step-detail">Do not use Inference as your first health-check page. Resolve camera, robot, and robot-type issues earlier on Home and Devices.</span>
          </li>
          <li>
            <span class="step-title">Load or review the policy selection</span>
            <span class="step-detail">Make sure the policy belongs to the same robot family and sensor schema as the runtime you are about to start.</span>
          </li>
          <li>
            <span class="step-title">Watch loading status carefully</span>
            <span class="step-detail">The runtime can still fail during load even if the UI responds normally. Watch the loading status, logs, and error indicators before trusting the policy.</span>
          </li>
          <li>
            <span class="step-title">Use the camera grid as the primary safety view</span>
            <span class="step-detail">The wrist, third, and top views together are your operational truth. Do not rely on only one camera when judging whether the behavior is safe.</span>
          </li>
          <li>
            <span class="step-title">Toggle depth view if it improves scene understanding</span>
            <span class="step-detail">The fourth tile can show the third-person depth overlay. Use it when the scene geometry matters more than RGB texture.</span>
          </li>
          <li>
            <span class="step-title">Stop immediately on unsafe or clearly wrong motion</span>
            <span class="step-detail">The page is intended for controlled validation. If the runtime looks unstable, stop and return to dataset review, training, or override workflows.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>How to read the page layout</h3>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Camera grid</h4>
            <p>Your main operator view. Use it to judge grasp alignment, scene drift, and unexpected robot behavior.</p>
          </article>
          <article class="mini-card">
            <h4>Inference panel</h4>
            <p>Contains the model-loading and runtime controls needed to start or stop inference.</p>
          </article>
          <article class="mini-card">
            <h4>Terminal log viewer</h4>
            <p>Use this to understand why a model failed to load or why the backend changed state unexpectedly.</p>
          </article>
          <article class="mini-card">
            <h4>Joint / URDF view</h4>
            <p>Useful for diagnosing configuration or motion anomalies that are harder to interpret from images alone.</p>
          </article>
        </div>
      </div>
      <div class="doc-callout warn">
        <h3>Common deployment mistakes</h3>
        <ul>
          <li>Running a checkpoint trained for a different robot or observation layout.</li>
          <li>Assuming that “page loaded” means “model loaded”.</li>
          <li>Ignoring camera evidence because terminal logs look clean.</li>
          <li>Letting a bad rollout continue too long in the hope that it will self-correct.</li>
        </ul>
      </div>
    `
  },
  datatools: {
    title: 'Data Tools',
    subtitle: 'Dataset curation, editing, and QA hub',
    purpose: 'Use Data Tools as the central curation workspace for datasets after collection. This page groups the major post-recording operations in one place: quality checks, filtering, Hugging Face integration, merge and delete actions, task-instruction editing, mask QA, and scatter inspection.',
    accessRule: 'Usually used after Record and before Training.',
    bestFor: 'Dataset cleanup and curation before model training',
    runtimeMode: 'Offline dataset management',
    audience: ['Data curator', 'ML Ops owner', 'Task owner'],
    prerequisites: [
      'The dataset should already exist on disk.',
      'If you plan to upload or download from Hugging Face, the account context should already be available.',
      'Back up any irreplaceable dataset before destructive actions such as delete or overwrite.'
    ],
    features: [
      'Acts as a launcher for all major dataset editing sections.',
      'Supports quality, filtering, merge, delete, and Hugging Face workflows.',
      'Includes task-instruction editing and segmentation or scatter utilities.',
      'Keeps all major post-recording operations inside one page shell.'
    ],
    services: ['/dataset/edit', '/dataset/get_info', '/dataset/check_quality', '/browse_file'],
    topics: ['/dataset/edit_status'],
    inputs: ['Dataset path', 'Selected tool section', 'Edit commands or QA options'],
    outputs: ['Edited dataset structure', 'Quality reports', 'Upload or download results'],
    relatedPages: ['Record creates the data edited here', 'Training should usually wait until this page is done'],
    tech: {
      component: 'physical_ai_manager/src/pages/EditDatasetPage.js',
      sections: 'Quality, Filter, Hugging Face, Merge, Delete, Task Instruction, Mask Timeline QA, Scatter',
      behavior: 'Single page shell switching feature sections',
      toastHandling: 'Global toast limit management'
    },
    userFlow: [
      'Choose the section that matches the current curation job.',
      'Load and inspect the dataset before editing.',
      'Run the required modification or QA pass.',
      'Re-check the dataset before handing it to Training.'
    ],
    expectedResult: ['The dataset is cleaner, better labeled, and safer to use for downstream training or analysis.'],
    userTips: ['Treat Data Tools as a curation checkpoint. The goal is not just to edit data, but to reduce avoidable downstream failures.'],
    guideHtml: `
      <div class="doc-block">
        <h3>How to use this page</h3>
        <p>Data Tools is a hub, not a single-purpose screen. The first decision is always: which curation task are you trying to complete right now?</p>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Quality Check</h4>
            <p>Use this first when you need a quick pass on whether the dataset is structurally and operationally healthy.</p>
          </article>
          <article class="mini-card">
            <h4>Filter Dataset</h4>
            <p>Use this when you need a subset, camera-specific cut, or expert-data selection.</p>
          </article>
          <article class="mini-card">
            <h4>Upload &amp; Download</h4>
            <p>Use the Hugging Face integration section when datasets must be moved between local storage and shared repositories.</p>
          </article>
          <article class="mini-card">
            <h4>Merge / Delete</h4>
            <p>Use these sections carefully. They modify the dataset layout and should usually be preceded by a backup.</p>
          </article>
          <article class="mini-card">
            <h4>Change Task Instruction</h4>
            <p>Use this to correct or normalize the language attached to dataset folders or episodes.</p>
          </article>
          <article class="mini-card">
            <h4>Mask Timeline QA / Scatter Plot</h4>
            <p>Use these for deeper inspection when vision annotations or feature distributions look suspicious.</p>
          </article>
        </div>
      </div>
      <div class="doc-block">
        <h3>Recommended operating order</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Start with a quality or structure review</span>
            <span class="step-detail">This prevents you from spending time editing a dataset that is already missing critical files or metadata.</span>
          </li>
          <li>
            <span class="step-title">Choose the smallest necessary edit</span>
            <span class="step-detail">Do not jump into merge or delete actions if a filter or instruction correction would solve the problem more safely.</span>
          </li>
          <li>
            <span class="step-title">Apply the modification and immediately re-check</span>
            <span class="step-detail">Every destructive or structural edit should be followed by another validation pass.</span>
          </li>
          <li>
            <span class="step-title">Hand the dataset forward only after QA is clean</span>
            <span class="step-detail">Once Data Tools is done, the next consumers are usually Training, Visualize, or analysis pages. Avoid passing unresolved issues forward.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Be careful with destructive sections</h3>
        <ul>
          <li>Delete and merge operations can permanently change dataset contents.</li>
          <li>Task instruction edits can silently alter language supervision semantics.</li>
          <li>Always preserve the original source dataset when the collection run is expensive to reproduce.</li>
        </ul>
      </div>
    `
  },
  augment: {
    title: 'Augment',
    subtitle: 'Vision and language augmentation',
    purpose: 'Use Augment to expand dataset diversity either visually or linguistically. The page supports both image-space augmentation for datasets and task-instruction augmentation through manual or LLM-assisted variants.',
    accessRule: 'Typically used after Record or Data Tools and before Training.',
    bestFor: 'Generalization improvement and controlled dataset expansion',
    runtimeMode: 'Offline augmentation',
    audience: ['Augmentation owner', 'Research engineer', 'Dataset owner'],
    prerequisites: [
      'The source dataset must already exist and be organized in a supported format.',
      'Decide whether you need visual augmentation, language augmentation, or both.',
      'For language augmentation, know whether you want manual instructions or LLM-generated variants.'
    ],
    features: [
      'Supports vision-mode augmentation such as brightness, blur, Gaussian noise, and color jitter.',
      'Supports language-mode instruction editing and variant generation.',
      'Shows sample previews and batch-progress tracking.',
      'Can write new task instructions back into the selected dataset.'
    ],
    services: ['/dataset/augment', '/dataset/get_sample_image', '/image/get_available_list', '/dataset/update_task_instructions', '/dataset/generate_instruction_variants', '/browse_file'],
    topics: ['/augmentation/status'],
    inputs: ['Dataset path', 'Augmentation configuration', 'Language prompts or instructions'],
    outputs: ['Augmented dataset or updated instruction set'],
    relatedPages: ['Training is the main downstream consumer', 'Visualize and Data Tools help inspect the result'],
    tech: {
      component: 'physical_ai_manager/src/pages/DataAugmentationPage.js',
      modes: 'vision | language',
      state: 'augmentationSlice + local batch and preview state',
      progress: '/augmentation/status topic and batch progress state'
    },
    userFlow: [
      'Choose whether the current job is vision augmentation or language augmentation.',
      'Inspect a sample before launching a large batch.',
      'Run the augmentation job and monitor output progress.',
      'Review the new dataset before sending it to Training.'
    ],
    expectedResult: ['The dataset gains controlled diversity while preserving the semantics needed for training.'],
    userTips: ['Small preview first, large batch later. Over-augmentation can damage performance just as easily as under-augmentation.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Choose the correct mode first</h3>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Vision mode</h4>
            <p>Use when the visual appearance of the dataset needs more diversity: lighting shifts, blur, noise, color changes, or similar image-space perturbations.</p>
          </article>
          <article class="mini-card">
            <h4>Language mode</h4>
            <p>Use when the task language should be made more diverse, normalized, or expanded through manual authoring or LLM-generated variants.</p>
          </article>
        </div>
      </div>
      <div class="doc-block">
        <h3>Vision augmentation workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Select the source dataset</span>
            <span class="step-detail">Make sure you are augmenting the correct dataset root, not an already-augmented derivative unless that is intentional.</span>
          </li>
          <li>
            <span class="step-title">Enable only the transforms you need</span>
            <span class="step-detail">Brightness, disturbance, salt-and-pepper, Gaussian noise, blur, and color jitter can all be adjusted independently. Avoid turning everything on by default.</span>
          </li>
          <li>
            <span class="step-title">Check preview images</span>
            <span class="step-detail">Use sample previews to make sure the transform strength is still realistic for the robot’s sensor domain.</span>
          </li>
          <li>
            <span class="step-title">Run the batch job and watch progress</span>
            <span class="step-detail">The page shows batch progress and output folder state. Keep watching until PRISM reports completion or failure explicitly.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>Language augmentation workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load the dataset task instructions</span>
            <span class="step-detail">Start by seeing what language is already present. Do not generate variants blindly before reviewing the original instructions.</span>
          </li>
          <li>
            <span class="step-title">Choose manual or LLM-assisted authoring</span>
            <span class="step-detail">Manual mode is better when exact wording matters. LLM mode is useful when you want many stylistic variants quickly.</span>
          </li>
          <li>
            <span class="step-title">Review generated variants before applying</span>
            <span class="step-detail">A generated instruction that sounds good can still introduce the wrong object identity or action semantics. Review them one by one if the task is safety-critical.</span>
          </li>
          <li>
            <span class="step-title">Apply the final instruction set to the dataset</span>
            <span class="step-detail">Once saved, these instructions become part of the training supervision. Do not apply them casually.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>What to watch out for</h3>
        <ul>
          <li>Transforms that make the scene unrealistic for the real robot cameras.</li>
          <li>Instruction variants that alter object identity, order of actions, or success criteria.</li>
          <li>Launching large batch jobs before confirming the output folder and source dataset.</li>
        </ul>
      </div>
    `
  },
  visualize: {
    title: 'Visualize',
    subtitle: 'Dataset state, trajectory, and frame inspection',
    purpose: 'Use Visualize to inspect Parquet or HDF5 data, graph numeric fields, inspect end-effector trajectories, and connect numerical outliers back to actual camera frames.',
    accessRule: 'Usually opened after Record, Kinematics, or Data Tools.',
    bestFor: 'Deep dataset debugging and trajectory analysis',
    runtimeMode: 'Offline analysis',
    audience: ['Data analyst', 'Model debugger', 'Research engineer'],
    prerequisites: [
      'Select a valid dataset path before expecting any table or graph output.',
      'If you need EEF trajectory analysis, the dataset should already contain or have been converted to EEF pose features.',
      'Be prepared for large datasets to load more slowly than small single-episode datasets.'
    ],
    features: [
      'Loads Parquet data, HDF5 views, and dataset info from the backend.',
      'Supports graph view, frame navigation, and all-episode analysis.',
      'Renders end-effector trajectories and links them back to image snapshots.',
      'Helps track down outliers by connecting plots to camera frames.'
    ],
    services: ['/dataset/get_parquet_data', '/dataset/get_info', '/dataset/get_sample_image', '/dataset/get_scatter_plot_data'],
    topics: ['Service-driven page; no primary long-lived topic is required for basic use'],
    inputs: ['Dataset path', 'Episode index', 'Selected columns or axes', 'Frame navigation'],
    outputs: ['Tables, graphs, trajectory plots, snapshots, and dataset diagnostics'],
    relatedPages: ['Kinematics enriches the dataset for better EEF analysis', 'Task Orchestration and Data Tools consume similar dataset context'],
    tech: {
      component: 'physical_ai_manager/src/pages/VisualizePage.js',
      views: 'graph, table, HDF5, EEF 3D, frame snapshot workflows',
      state: 'dataset info + current episode + current frame + all-scope caches',
      rendering: 'canvas and 3D scene helpers'
    },
    userFlow: [
      'Load the dataset and episode first.',
      'Inspect rows and field names before choosing any graph axes.',
      'Use plots and frame snapshots together to interpret anomalies.',
      'Switch to all-episode or EEF views only after a single-episode pass makes sense.'
    ],
    expectedResult: ['You can explain odd behavior or data quality issues with both numerical evidence and frame-level context.'],
    userTips: ['Start narrow. One episode and one suspicious region are usually enough to identify the root cause before you scale up analysis.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Recommended usage pattern</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load the dataset and basic info</span>
            <span class="step-detail">Start by confirming the dataset metadata, total episode count, and whether the expected features exist.</span>
          </li>
          <li>
            <span class="step-title">Inspect raw rows before choosing axes</span>
            <span class="step-detail">Use the table view to understand column names and shapes. This avoids plotting the wrong fields or misreading nested state arrays.</span>
          </li>
          <li>
            <span class="step-title">Pick a graph or scatter view that matches your question</span>
            <span class="step-detail">If the issue is temporal, use frame navigation and per-episode graphs. If the issue is distributional, use scatter or all-episode analysis.</span>
          </li>
          <li>
            <span class="step-title">Use snapshots to interpret outliers</span>
            <span class="step-detail">When you find an unusual point, click or navigate to the matching frame and inspect the corresponding image. This is often the fastest route to root cause.</span>
          </li>
          <li>
            <span class="step-title">Use EEF views when robot-space interpretation matters</span>
            <span class="step-detail">EEF trajectory and orientation views are especially useful for manipulation tasks where image anomalies alone are ambiguous.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>Main analysis modes</h3>
        <div class="mini-grid">
          <article class="mini-card">
            <h4>Parquet table view</h4>
            <p>Best for understanding what fields actually exist and what their value shapes look like.</p>
          </article>
          <article class="mini-card">
            <h4>Graph view</h4>
            <p>Best for frame-by-frame temporal behavior within one episode.</p>
          </article>
          <article class="mini-card">
            <h4>Scatter analysis</h4>
            <p>Best for feature relationships and outlier hunting across larger slices of data.</p>
          </article>
          <article class="mini-card">
            <h4>EEF trajectory view</h4>
            <p>Best for motion-shape diagnosis, path smoothness, and grasp or place geometry reasoning.</p>
          </article>
        </div>
      </div>
      <div class="doc-callout warn">
        <h3>Common mistakes</h3>
        <ul>
          <li>Jumping to all-dataset analysis before understanding a single episode.</li>
          <li>Reading nested arrays as if they were scalar fields.</li>
          <li>Assuming an outlier is bad data without checking the matching image frame.</li>
        </ul>
      </div>
    `
  },
  sam2: {
    title: 'SAM2',
    subtitle: 'Offline segmentation and mask tracking',
    purpose: 'Use SAM2 to annotate and track object masks on recorded datasets. The page supports prompt-based object definition, per-camera mask inspection, tracking, and saving masks back into dataset metadata.',
    accessRule: 'Use on recorded datasets, not on live camera streams.',
    bestFor: 'Offline mask generation and review',
    runtimeMode: 'Offline annotation',
    audience: ['Vision annotation owner', 'Dataset labeling operator', 'Perception engineer'],
    prerequisites: [
      'A recorded dataset with accessible sample images must already exist.',
      'Choose the episode and camera you want to annotate before creating prompts.',
      'Be prepared to check prompt quality on the first frame before tracking across many frames.'
    ],
    features: [
      'Loads dataset frames and camera views for offline annotation.',
      'Supports point and box prompting per object.',
      'Tracks masks across frames and stores overlay state.',
      'Saves masks in a dataset-friendly format after review.'
    ],
    services: ['/browse_file', '/dataset/get_info', '/dataset/get_sample_image', '/sam2/predict', '/sam2/track', '/sam2/save_masks', '/sam2/get_mask'],
    topics: ['/annotation/sam2_tracking_status'],
    inputs: ['Dataset path', 'Episode', 'Camera', 'Point or box prompts', 'Tracking options'],
    outputs: ['Predicted masks', 'Tracked masks', 'Saved annotation files'],
    relatedPages: ['Detection may provide prompts or object context', 'Data Tools can review mask timeline QA after saving'],
    tech: {
      component: 'physical_ai_manager/src/pages/SAM2Page.js',
      serviceHook: 'sam2Predict, sam2Track, sam2SaveMasks, sam2GetMask',
      objectState: 'multi-object prompt and visibility management',
      playback: 'episode frame player with per-camera images'
    },
    userFlow: [
      'Select dataset, episode, and camera.',
      'Create the initial prompt on a representative frame.',
      'Run predict, inspect, and only then expand to tracking.',
      'Save masks after checking overlay quality.'
    ],
    expectedResult: ['You obtain usable object masks for recorded data without leaving the PRISM workflow.'],
    userTips: ['The first prompt matters more than the later tracking settings. Spend time getting the first frame right.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Offline annotation workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load the dataset and choose an episode</span>
            <span class="step-detail">Make sure the episode actually contains the target object and a useful camera view before creating any annotation state.</span>
          </li>
          <li>
            <span class="step-title">Select the camera with the clearest object visibility</span>
            <span class="step-detail">Tracking quality improves when the object is well separated and clearly visible in the prompt frame.</span>
          </li>
          <li>
            <span class="step-title">Add prompts for the active object</span>
            <span class="step-detail">Use positive or negative points and boxes to define the object mask. If the page supports multiple objects, keep the active object explicit so masks do not get mixed.</span>
          </li>
          <li>
            <span class="step-title">Run prediction on the current frame</span>
            <span class="step-detail">Inspect the overlay before tracking. If the initial mask is clearly wrong, fix prompts first rather than hoping tracking will repair it.</span>
          </li>
          <li>
            <span class="step-title">Track across frames only after the initial mask is stable</span>
            <span class="step-detail">Tracking spreads the quality of the first prompt over time. Bad initialization usually creates bad tracks.</span>
          </li>
          <li>
            <span class="step-title">Save masks only after spot-checking several frames</span>
            <span class="step-detail">Do not trust a single good frame. Check temporal consistency before writing annotation outputs.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>When not to save yet</h3>
        <ul>
          <li>If masks drift badly after occlusion or large motion.</li>
          <li>If object IDs are mixed across cameras or frames.</li>
          <li>If the overlay looks good on one frame but not on neighboring frames.</li>
        </ul>
      </div>
    `
  },
  rtsam: {
    title: 'Realtime SAM2',
    subtitle: 'Live topic segmentation and tracking',
    purpose: 'Use Realtime SAM2 when you need prompt-based object tracking directly on a live camera topic. The page focuses on interactive prompt creation, mask locking, online tracking, and tracker stabilization settings.',
    accessRule: 'Use on live camera topics, not recorded datasets.',
    bestFor: 'Live object locking and interactive tracking',
    runtimeMode: 'Real-time perception',
    audience: ['Live demo operator', 'Perception engineer', 'Interactive tracking tester'],
    prerequisites: [
      'A valid live image topic must already exist.',
      'The operator should know which object will be locked before starting prompt interaction.',
      'Live tracking works best when the stream is healthy and not heavily delayed.'
    ],
    features: [
      'Loads available image topics and displays a live stream.',
      'Supports click or drag prompts for interactive object definition.',
      'Adds tracker options such as relock, cached prompt use, EMA stabilization, and drift handling.',
      'Manages multiple visible objects with individual colors and state.'
    ],
    services: ['/image/get_available_list', '/sam2/realtime_infer'],
    topics: ['/annotation/realtime_sam_status'],
    inputs: ['Live topic selection', 'Prompt points or boxes', 'Tracking controls'],
    outputs: ['Live tracked masks', 'Tracking status counters', 'Prompt and lock state'],
    relatedPages: ['RAIN extends this workflow with action-sequence authoring', 'FoundationPose can reuse prompt-style scene setup'],
    tech: {
      component: 'physical_ai_manager/src/pages/RealtimeSAMInferencePage.js',
      stream: 'web_video_server style MJPEG stream + topic refresh',
      trackingState: 'objects, lock state, masks, counters, fallback controls',
      controls: 'prompt modes, relock, cached mask guard, temporal stabilizers'
    },
    userFlow: [
      'Select the live topic and confirm that frames are updating.',
      'Add prompts to the target object and lock the initial mask.',
      'Start tracking and watch for drift or stale-frame fallback.',
      'Relock or adjust tracker settings as the scene changes.'
    ],
    expectedResult: ['You keep a stable live mask on the target object long enough to support perception or downstream action workflows.'],
    userTips: ['When the scene changes suddenly, a manual relock is usually faster and safer than fighting the tracker with many extra prompts.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Recommended live-tracking routine</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Select the correct live topic</span>
            <span class="step-detail">Do not start from an arbitrary topic. Choose the camera that will actually be used for tracking and action context.</span>
          </li>
          <li>
            <span class="step-title">Wait for a stable, current frame</span>
            <span class="step-detail">If the stream is stale or choppy, prompt quality becomes misleading. Stabilize the stream before you annotate.</span>
          </li>
          <li>
            <span class="step-title">Create a clean prompt on the target object</span>
            <span class="step-detail">Prefer a small number of accurate points or one useful box over many noisy prompts.</span>
          </li>
          <li>
            <span class="step-title">Lock the mask before starting continuous tracking</span>
            <span class="step-detail">The lock step gives you a stable starting point. If you skip this, live tracking quality usually becomes less predictable.</span>
          </li>
          <li>
            <span class="step-title">Start tracking and watch the counters</span>
            <span class="step-detail">Success count, reject count, and latency are there to help you judge whether the tracker is still healthy.</span>
          </li>
          <li>
            <span class="step-title">Use relock and stabilization settings when drift appears</span>
            <span class="step-detail">Use cached prompt-only behavior, mask guards, or relock depending on how severe the drift is.</span>
          </li>
        </ol>
      </div>
      <div class="doc-block">
        <h3>When to change settings</h3>
        <div class="note-list">
          <article class="note-card">
            <strong>Scene changes sharply</strong>
            <p>Try manual relock first. It is often more reliable than adding many emergency prompts.</p>
          </article>
          <article class="note-card">
            <strong>Mask grows too large</strong>
            <p>Use stricter guard settings or reduce allowed coverage so the tracker stops accepting implausible masks.</p>
          </article>
          <article class="note-card">
            <strong>Frames become stale</strong>
            <p>Check whether the page has fallen back from stream-driven updates to polling behavior and decide whether the tracking result is still trustworthy.</p>
          </article>
        </div>
      </div>
    `
  },
  detection: {
    title: 'Detection',
    subtitle: 'Prompt-driven object detection on recorded datasets',
    purpose: 'Use Detection to run object detection against recorded dataset frames, inspect detections per camera, optionally generate masks, and save the result set into dataset metadata.',
    accessRule: 'Use on recorded datasets after collection.',
    bestFor: 'Bounding-box or mask initialization on existing datasets',
    runtimeMode: 'Offline detection',
    audience: ['Annotation operator', 'Perception engineer', 'Dataset curator'],
    prerequisites: [
      'The dataset must contain a valid videos folder structure or camera sample images.',
      'You should know the object prompt you want to search for before opening the batch path.',
      'If you plan to save results, confirm that the dataset location is writable.'
    ],
    features: [
      'Loads dataset frames and task instruction context for the selected episode.',
      'Runs prompt-based detection with configurable box and text thresholds.',
      'Can generate colored mask overlays and save detections back into metadata.',
      'Supports batch detection across many frames.'
    ],
    services: ['/dataset/get_info', '/browse_file', '/dataset/get_sample_image', '/dataset/get_parquet_data', '/annotation/detect_objects', '/annotation/save_detections', '/annotation/batch_detect_objects', '/sam2/predict'],
    topics: ['/annotation/batch_detection_status'],
    inputs: ['Dataset path', 'Episode and frame', 'Object prompt', 'Thresholds'],
    outputs: ['Per-camera detections', 'Optional masks', 'Saved metadata under the dataset'],
    relatedPages: ['SAM2 can refine object masks after detection', 'Data Tools can review the saved dataset later'],
    artifacts: ['Detection metadata stored under dataset meta directories'],
    tech: {
      component: 'physical_ai_manager/src/pages/ObjectDetectionPage.js',
      helpers: 'dataset validation + frame player + mask overlay composition',
      services: 'detectObjects, saveDetections, batchDetectObjects, sam2Predict',
      playback: 'frame stepping with image fetch per camera'
    },
    userFlow: [
      'Load the dataset and verify camera folders.',
      'Enter an object prompt and run detection on a representative frame.',
      'Refine thresholds or prompt wording until overlays look correct.',
      'Save or batch-run only after spot checks pass.'
    ],
    expectedResult: ['You attach consistent detection metadata to the dataset without a separate annotation tool.'],
    userTips: ['Prompt wording is often more important than threshold tuning. Start by improving the noun phrase before pushing thresholds too hard.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Detection workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Select the dataset and let PRISM validate it</span>
            <span class="step-detail">The page checks whether a usable <code>videos</code> folder exists. If this fails, fix the dataset structure before trying to annotate.</span>
          </li>
          <li>
            <span class="step-title">Choose the episode and review the task instruction</span>
            <span class="step-detail">The task instruction helps you phrase the detection prompt in a way that matches the actual manipulation context.</span>
          </li>
          <li>
            <span class="step-title">Run detection on a representative frame first</span>
            <span class="step-detail">Do not start with a batch job. Make sure the single-frame overlays and labels are reasonable first.</span>
          </li>
          <li>
            <span class="step-title">Tune the prompt and thresholds</span>
            <span class="step-detail">If detections are empty or noisy, refine the prompt wording first, then adjust box and text thresholds.</span>
          </li>
          <li>
            <span class="step-title">Save detections or expand to a batch run</span>
            <span class="step-detail">Once you trust the visual overlays, save the result or run batch detection with a sensible frame-skip value.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>When to pause the workflow</h3>
        <ul>
          <li>If no camera images are loading for the selected frame.</li>
          <li>If detections are inconsistent across cameras and the prompt wording is still vague.</li>
          <li>If the page would save outputs before you have checked at least a few representative frames.</li>
        </ul>
      </div>
    `
  },
  tt: {
    title: 'Task Orchestration',
    subtitle: 'Trajectory-guided subtask and sequence authoring',
    purpose: 'Use Task Orchestration to break an episode into subtasks, inspect trajectory and action-change cues, and save a reusable task sequence definition based on recorded data.',
    accessRule: 'Use on recorded datasets after at least one inspection pass.',
    bestFor: 'Subtask segmentation, marker authoring, and sequence export',
    runtimeMode: 'Offline task-structure authoring',
    audience: ['Task designer', 'Automation workflow owner', 'Research engineer'],
    prerequisites: [
      'A dataset with accessible sample images and state rows must already exist.',
      'The dataset should ideally include EEF pose or be convertible to it for richer splitting logic.',
      'You should know whether you want manual, auto, prior-guided, or trajectory-only segmentation.'
    ],
    features: [
      'Loads trajectory, gripper, action, and task context for a recorded episode.',
      'Supports multiple splitting modes including prior-guided and trajectory-only segmentation.',
      'Lets you edit marker ranges and subtask annotations directly in the UI.',
      'Saves the resulting task sequence and falls back to local backup export if service save fails.'
    ],
    services: ['/dataset/get_info', '/dataset/get_sample_image', '/dataset/get_parquet_data', '/task/save_sequence'],
    topics: ['Primarily service-driven for this page'],
    inputs: ['Dataset path', 'Episode selection', 'Split mode', 'Marker edits and annotations'],
    outputs: ['Task sequence JSON and saved segmentation metadata'],
    relatedPages: ['Visualize helps inspect the same trajectory data', 'Kinematics can improve the available EEF information first'],
    artifacts: ['Saved task sequence definitions', 'Local backup JSON if service save fails'],
    tech: {
      component: 'physical_ai_manager/src/pages/TaskOrchestrationPage.js',
      analysis: 'trajectory parsing + signal extraction + marker generation heuristics',
      savePath: 'saveTaskSequence service with backup download fallback',
      views: 'timeline, trajectory, image and signal panels'
    },
    userFlow: [
      'Load the dataset and episode context.',
      'Choose a split mode and generate initial markers.',
      'Correct marker boundaries and annotate each segment.',
      'Save the resulting sequence once it reflects the real task flow.'
    ],
    expectedResult: ['You obtain a structured subtask sequence that can be reused for later analysis or execution workflows.'],
    userTips: ['Automatic splitting is a draft, not the final answer. The page is most valuable when the operator checks and edits the markers.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Recommended authoring order</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load one episode and inspect the first image and trajectory</span>
            <span class="step-detail">Make sure the episode is representative. If the episode itself is noisy, segmentation quality will also be poor.</span>
          </li>
          <li>
            <span class="step-title">Choose the split mode intentionally</span>
            <span class="step-detail">Use auto or prior-guided modes when you want a fast first draft. Use trajectory-only mode when motion structure is the main signal. Use manual cleanup afterward either way.</span>
          </li>
          <li>
            <span class="step-title">Review the generated markers on timeline and trajectory views</span>
            <span class="step-detail">A good split should line up with visible action changes, gripper transitions, or meaningful path changes.</span>
          </li>
          <li>
            <span class="step-title">Edit ranges and subtask text</span>
            <span class="step-detail">Adjust each marker boundary until the semantic beginning and end of the subtask are clear. Then write labels that a later consumer can interpret without ambiguity.</span>
          </li>
          <li>
            <span class="step-title">Save and keep the backup</span>
            <span class="step-detail">Even if the backend save succeeds, keep the backup mindset. Task sequences are logic artifacts and should be versioned like code.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Why saved sequences fail later</h3>
        <ul>
          <li>Markers were never manually corrected after automatic generation.</li>
          <li>Subtask labels are vague and do not encode the intended action clearly.</li>
          <li>The episode used for authoring was not representative of the real task family.</li>
        </ul>
      </div>
    `
  },
  kinematics: {
    title: 'Kinematics',
    subtitle: 'Joint-space to end-effector-space conversion',
    purpose: 'Use Kinematics to compute end-effector pose features from joint-based datasets, inspect whether the conversion worked, and prepare the dataset for trajectory-centric analysis.',
    accessRule: 'Use after recording when the dataset lacks EEF pose features.',
    bestFor: 'Preparing datasets for EEF-based analysis or downstream task splitting',
    runtimeMode: 'Offline data conversion',
    audience: ['Data conversion owner', 'Research engineer', 'Trajectory analysis owner'],
    prerequisites: [
      'The dataset must already exist and contain usable robot state for kinematic conversion.',
      'You must know the correct base frame and target frame names for the selected robot.',
      'If you are unsure about frame names, confirm them before conversion rather than guessing.'
    ],
    features: [
      'Loads dataset info, schema, and sample rows before conversion.',
      'Runs EEF conversion through the backend service.',
      'Shows whether EEF features are now present in the dataset.',
      'Provides quick trajectory previews and a direct jump to Visualize.'
    ],
    services: ['/dataset/get_info', '/dataset/convert_to_eef', '/dataset/get_parquet_data', '/dataset/get_scatter_plot_data'],
    topics: ['Service-driven page'],
    inputs: ['Dataset path', 'Base frame', 'Target frame'],
    outputs: ['EEF pose feature added to dataset', 'Updated preview and trajectory scatter'],
    relatedPages: ['Visualize and Task Orchestration benefit directly from the converted data'],
    tech: {
      component: 'physical_ai_manager/src/pages/KinematicsPage.js',
      services: 'getDatasetInfo, convertToEEF, getParquetData, getScatterPlotData',
      validation: 'post-conversion feature inspection and XY/XZ trajectory preview',
      defaults: 'robot-type-based frame defaults'
    },
    userFlow: [
      'Load the dataset and inspect its current feature set.',
      'Set base and target frames correctly.',
      'Run conversion and verify that EEF features now exist.',
      'Inspect the result or jump to Visualize for deeper analysis.'
    ],
    expectedResult: ['The dataset becomes usable for EEF-based trajectory analysis and segmentation workflows.'],
    userTips: ['Frame-name mistakes are the most common source of failure. Solve naming uncertainty first.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Conversion procedure</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load the dataset and inspect current features</span>
            <span class="step-detail">The page shows feature schema and sample rows so you can confirm whether EEF pose already exists or not.</span>
          </li>
          <li>
            <span class="step-title">Set the base and target frames</span>
            <span class="step-detail">PRISM provides robot-type-aware defaults, but you should still confirm them. Wrong frame names make the conversion meaningless even if it technically runs.</span>
          </li>
          <li>
            <span class="step-title">Run the conversion</span>
            <span class="step-detail">The page switches into a conversion progress state and reports success or failure once the backend finishes.</span>
          </li>
          <li>
            <span class="step-title">Verify the result immediately</span>
            <span class="step-detail">Look for the new EEF feature in the dataset context and inspect the quick XY or XZ previews. A successful service call is not enough by itself.</span>
          </li>
          <li>
            <span class="step-title">Move to Visualize if deeper inspection is needed</span>
            <span class="step-detail">The page includes a direct link into Visualize so you can continue with trajectory-level analysis without re-entering the dataset path.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Stop and re-check if</h3>
        <ul>
          <li>The service reports success but the new feature is missing from the post-conversion schema.</li>
          <li>The trajectory preview is clearly nonsensical for the robot and task.</li>
          <li>You are not confident about base and target frame names.</li>
        </ul>
      </div>
    `
  },
  calib: {
    title: 'Camera Calibration',
    subtitle: 'Extrinsic calibration server control and embedded UI',
    purpose: 'Use Camera Calibration to launch or monitor the calibration helper server, open the calibration UI, and apply a disciplined point-capture workflow for camera-to-robot alignment.',
    accessRule: 'Use when camera extrinsics drift or after a camera stack change.',
    bestFor: 'Camera-to-robot alignment and extrinsic recovery',
    runtimeMode: 'Calibration utility',
    audience: ['Calibration engineer', 'Maintenance owner', 'Perception setup engineer'],
    prerequisites: [
      'You must know which camera, base frame, and end-effector target frame you intend to calibrate.',
      'The calibration helper script must exist in the backend environment.',
      'The operator should understand that calibration quality depends heavily on careful point capture across diverse poses.'
    ],
    features: [
      'Builds and shows the calibration launch command directly in the page.',
      'Controls calibration server start, stop, and status through a ROS service.',
      'Embeds the external calibration UI in an iframe or opens it in a new tab.',
      'Explains capture quality expectations such as RMSE and drift thresholds.'
    ],
    services: ['/camera/control_calibration'],
    topics: ['Service-driven page with embedded HTTP calibration UI'],
    inputs: ['Camera name', 'Base frame', 'Target frame', 'Calibration UI interaction'],
    outputs: ['Calibration server state', 'tf offset or calibration result to apply externally'],
    relatedPages: ['Devices and Inference benefit directly from better calibrated cameras'],
    tech: {
      component: 'physical_ai_manager/src/pages/CameraCalibrationPage.js',
      script: 'utils/calibrate_camera_tf.py',
      serviceHook: 'controlCameraCalibration(command)',
      UIBridge: 'embedded iframe + server status polling'
    },
    userFlow: [
      'Choose camera and frame names.',
      'Start or verify the calibration server.',
      'Use the embedded UI to capture points across many poses.',
      'Review calibration error and apply the resulting transform only if quality is acceptable.'
    ],
    expectedResult: ['Camera extrinsics become aligned enough for perception and manipulation workflows to recover.'],
    userTips: ['Wide pose coverage matters more than collecting many nearly identical points.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Calibration workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Select the camera and frame configuration</span>
            <span class="step-detail">Set the camera name, base frame, target frame, and server port. Confirm these before starting the server.</span>
          </li>
          <li>
            <span class="step-title">Check calibration server status</span>
            <span class="step-detail">Use the status action first if you suspect an old calibration server is already running. Avoid launching duplicate processes on the same port.</span>
          </li>
          <li>
            <span class="step-title">Start the calibration server</span>
            <span class="step-detail">Use the page control to launch the helper and verify that the embedded UI URL resolves correctly.</span>
          </li>
          <li>
            <span class="step-title">Capture 6 to 10 or more well-spread poses</span>
            <span class="step-detail">Move the robot so the end-effector tip covers different regions of the image and workspace. Avoid collecting many nearly identical poses.</span>
          </li>
          <li>
            <span class="step-title">Solve and review error metrics</span>
            <span class="step-detail">Use the embedded UI to compute the calibration. Review RMSE and drift quality before deciding to apply the result.</span>
          </li>
          <li>
            <span class="step-title">Apply the transform carefully</span>
            <span class="step-detail">Copy the resulting offset, apply it to the relevant camera YAML or configuration, restart the camera stack, and then re-check alignment.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Bad calibration signs</h3>
        <ul>
          <li>High RMSE even after many captures.</li>
          <li>Points collected from a very narrow image region only.</li>
          <li>The server URL or iframe keeps failing because an old process is still bound to the port.</li>
        </ul>
      </div>
    `
  },
  embedding: {
    title: 'Embedding',
    subtitle: 'Checkpoint representation-space analysis',
    purpose: 'Use Embedding to extract latent embeddings from saved policy checkpoints over one or more datasets, then inspect the result with a 2D projection such as t-SNE or UMAP.',
    accessRule: 'Use after Training when saved checkpoints already exist.',
    bestFor: 'Checkpoint comparison and representation analysis',
    runtimeMode: 'Offline interpretation',
    audience: ['Experiment analyst', 'Research engineer', 'Model interpretation owner'],
    prerequisites: [
      'At least one saved checkpoint must already exist.',
      'You should know which datasets are meaningful comparison targets for that checkpoint.',
      'Projection parameters should start conservative if you are exploring a new model family.'
    ],
    features: [
      'Loads saved policy checkpoints from the backend.',
      'Starts asynchronous embedding extraction tasks.',
      'Subscribes to extraction status and parses returned scatter data.',
      'Renders interactive scatter plots with pan, zoom, and hover details.'
    ],
    services: ['/policy/get_saved_list', '/embedding/extract_model_embeddings'],
    topics: ['/embedding/extraction_status'],
    inputs: ['Model checkpoint path', 'Dataset list', 'Projection method and sampling settings'],
    outputs: ['2D embedding scatter', 'Status metrics and task results'],
    relatedPages: ['Training produces the checkpoints used here', 'Visualize can help explain clusters once you identify them'],
    tech: {
      component: 'physical_ai_manager/src/pages/EmbeddingPage.js',
      serviceHook: 'getSavedPolicies, extractModelEmbeddings',
      resultTopic: '/embedding/extraction_status',
      rendering: 'custom canvas scatter with pan and zoom'
    },
    userFlow: [
      'Select a checkpoint and one or more datasets.',
      'Choose projection and sampling parameters.',
      'Launch extraction and wait for the async task to complete.',
      'Inspect cluster structure and hover details to interpret the result.'
    ],
    expectedResult: ['You can compare how a model organizes data internally and identify dataset or task separation patterns.'],
    userTips: ['Start small. A smaller sample often helps you choose sane projection settings before spending time on a large extraction.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Recommended extraction procedure</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load the saved model list</span>
            <span class="step-detail">Pick the exact checkpoint you want to study. Be precise about whether you are comparing policy types, datasets, or training stages.</span>
          </li>
          <li>
            <span class="step-title">Add only meaningful datasets</span>
            <span class="step-detail">The projection is most informative when the compared datasets answer a clear question, for example domain shift, task family separation, or training-stage progression.</span>
          </li>
          <li>
            <span class="step-title">Choose projection settings conservatively</span>
            <span class="step-detail">Use a manageable sample count, frame skip, and projection method first. Refine later if the result is promising.</span>
          </li>
          <li>
            <span class="step-title">Run extraction and wait for completion</span>
            <span class="step-detail">This page starts an asynchronous job and listens on the status topic. Let the status finish cleanly before trusting the scatter result.</span>
          </li>
          <li>
            <span class="step-title">Interpret clusters carefully</span>
            <span class="step-detail">A visible cluster does not automatically mean semantic separation. Use hover details and knowledge of the source datasets to explain what the points actually mean.</span>
          </li>
        </ol>
      </div>
    `
  },
  subgoal: {
    title: 'Subgoal Annotation',
    subtitle: 'Experimental keyframe and subgoal timeline annotation',
    purpose: 'Use Subgoal Annotation to segment recorded episodes into keyframes or subgoals, review the proposed boundaries, and save or reload subgoal annotations for experimental workflows.',
    accessRule: 'Experimental page; use only when the backend path is confirmed.',
    bestFor: 'Prototype subgoal annotation workflows',
    runtimeMode: 'Experimental offline annotation',
    audience: ['Research engineer', 'Subgoal annotation owner', 'Experimental feature validator'],
    prerequisites: [
      'A valid dataset and episode must already exist.',
      'Confirm that the backend services for keyframe detection and annotation are available.',
      'Treat this page as experimental unless your deployment explicitly depends on it.'
    ],
    features: [
      'Loads dataset images and state context for an episode.',
      'Can call automatic keyframe or segmentation services.',
      'Lets you save and reload subgoal annotations.',
      'Provides timeline-oriented review of the generated structure.'
    ],
    services: ['/dataset/get_info', '/browse_file', '/annotation/detect_keyframes', '/annotation/save', '/annotation/load', '/annotation/segment_episode', '/dataset/get_sample_image', '/dataset/get_parquet_data'],
    topics: ['Service-driven page'],
    inputs: ['Dataset path', 'Episode', 'Camera', 'Segmentation options'],
    outputs: ['Saved subgoal annotation files and timeline structures'],
    relatedPages: ['Task Orchestration is the more mature structured-task page in the current app'],
    tech: {
      component: 'physical_ai_manager/src/pages/SubgoalAnnotationPage.js',
      serviceHook: 'detectKeyframes, saveAnnotation, loadAnnotation, segmentEpisode',
      playback: 'episode frame player with annotation state',
      status: 'experimental page not currently wired into main navigation'
    },
    userFlow: [
      'Load dataset and episode context.',
      'Run automatic segmentation or keyframe detection.',
      'Adjust or verify the resulting boundaries.',
      'Save and reload to confirm annotation integrity.'
    ],
    expectedResult: ['You can produce experimental subgoal structures for a recorded episode.'],
    userTips: ['Because this page is not currently part of the main runtime navigation, verify backend readiness before planning around it.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Use this page carefully</h3>
        <p>This page exists, but it is not currently wired into the main app navigation. Treat it as an experimental annotation surface rather than a guaranteed production workflow.</p>
      </div>
      <div class="doc-block">
        <h3>Basic workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load the dataset, episode, and camera</span>
            <span class="step-detail">Make sure the selected camera actually shows the action transitions you care about.</span>
          </li>
          <li>
            <span class="step-title">Run the automatic segmentation helper</span>
            <span class="step-detail">Use the page services to generate the initial subgoal or keyframe structure.</span>
          </li>
          <li>
            <span class="step-title">Review the result manually</span>
            <span class="step-detail">Experimental automatic segmentation should never be trusted without manual spot checks.</span>
          </li>
          <li>
            <span class="step-title">Save and reload</span>
            <span class="step-detail">Always reload saved output at least once to confirm that the annotation is still interpretable after persistence.</span>
          </li>
        </ol>
      </div>
    `
  },
  foundationpose: {
    title: 'FoundationPose',
    subtitle: 'Realtime 6D pose estimation workspace',
    purpose: 'Use FoundationPose to estimate 6D object pose from a live image topic, optionally use SAM2-based prompt assist, and iterate on request JSON until pose outputs are stable and meaningful.',
    accessRule: 'Use on live camera topics when 6D pose is needed.',
    bestFor: 'Realtime pose-estimation experiments and prompt-assisted pose setup',
    runtimeMode: 'Real-time perception utility',
    audience: ['Perception engineer', 'Pose-estimation tester', 'Research operator'],
    prerequisites: [
      'A live RGB topic must already be available.',
      'You should know the target object label and, if relevant, the mesh path used for estimation.',
      'Pose-estimation quality depends on a good prompt or bounding geometry. Plan the prompt first.'
    ],
    features: [
      'Loads live image topics and streams the selected topic.',
      'Supports JSON request editing and form-driven sync.',
      'Uses SAM2 realtime inference as a prompt-assist helper.',
      'Can auto-run pose estimation at a configured interval.'
    ],
    services: ['/foundation_pose/estimate', '/image/get_available_list', '/sam2/realtime_infer'],
    topics: ['Live image topic through web_video_server'],
    inputs: ['Camera topic', 'Object name and prompt', 'Mesh path', 'Prompt points or boxes'],
    outputs: ['Estimated 6D pose and service response diagnostics'],
    relatedPages: ['Realtime SAM2 provides closely related prompt logic', 'RAIN can reuse live scene object context'],
    tech: {
      component: 'physical_ai_manager/src/pages/FoundationPosePage.js',
      services: 'foundationPoseEstimate, getImageTopicList, sam2RealtimeInfer',
      requestModel: 'JSON request synced from form fields',
      loopMode: 'optional auto-run at a safe interval'
    },
    userFlow: [
      'Select a live topic and confirm stream health.',
      'Set object identity and request parameters.',
      'Use prompt assist if needed, then run estimation.',
      'Refine request JSON until the pose result is stable enough for the task.'
    ],
    expectedResult: ['You can repeatedly estimate object pose on a live stream with enough context to debug failures quickly.'],
    userTips: ['Keep the request JSON simple at first. Only add points or boxes when the basic prompt is not enough.'],
    guideHtml: `
      <div class="doc-block">
        <h3>Realtime pose-estimation workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Load a live RGB topic</span>
            <span class="step-detail">The page filters toward RGB-style topics. Confirm the stream is current before building any request.</span>
          </li>
          <li>
            <span class="step-title">Set object identity and mesh information</span>
            <span class="step-detail">Fill object name, object prompt, and mesh path if the method requires it. These values define what pose is being estimated.</span>
          </li>
          <li>
            <span class="step-title">Sync the request JSON from the form</span>
            <span class="step-detail">Use the form as the source of truth first, then use the JSON only for advanced refinement.</span>
          </li>
          <li>
            <span class="step-title">Use prompt assist if localization is weak</span>
            <span class="step-detail">The page can call SAM2 realtime inference to get a stronger starting point before asking for FoundationPose output.</span>
          </li>
          <li>
            <span class="step-title">Run estimation and inspect latency and pose</span>
            <span class="step-detail">Watch not only whether a result exists, but whether latency and pose quality are acceptable for your scenario.</span>
          </li>
          <li>
            <span class="step-title">Enable auto-run only after the request is stable</span>
            <span class="step-detail">Do not start periodic estimation before a manual single-shot request is already producing meaningful output.</span>
          </li>
        </ol>
      </div>
    `
  },
  rain: {
    title: 'RAIN',
    subtitle: 'Mask-grounded action sequence authoring',
    purpose: 'Use RAIN to turn live tracked objects into action-sequence drafts. The page combines realtime SAM2-style masking with step creation, primitive execution, and task-sequence saving.',
    accessRule: 'Use on live topics when action design depends on a tracked object.',
    bestFor: 'Realtime visual grounding for action-sequence authoring',
    runtimeMode: 'Real-time authoring and execution support',
    audience: ['Task designer', 'Realtime demo operator', 'Primitive execution tester'],
    prerequisites: [
      'A live topic must already be available.',
      'You should already know the target object and intended manipulation action family.',
      'The primitive-execution backend must be ready if you plan to test execution directly from this page.'
    ],
    features: [
      'Performs live prompt-based object masking and tracking.',
      'Lets you add RAIN sequence steps tied to the active tracked target.',
      'Can execute primitives from the current action draft.',
      'Saves task sequences for later reuse.'
    ],
    services: ['/image/get_available_list', '/sam2/realtime_infer', '/task/execute_primitive', '/task/save_sequence'],
    topics: ['Live image topic through web_video_server'],
    inputs: ['Live topic', 'Object prompts', 'RAIN action type and step parameters'],
    outputs: ['Tracked object state', 'RAIN sequence drafts', 'Saved task sequence'],
    relatedPages: ['Realtime SAM2 is the closest base workflow', 'Task Orchestration is the offline counterpart for sequence authoring'],
    artifacts: ['Saved RAIN task sequence path'],
    tech: {
      component: 'physical_ai_manager/src/pages/RAINPage.js',
      services: 'getImageTopicList, sam2RealtimeInfer, executePrimitive, saveTaskSequence',
      state: 'tracked objects + RAIN step list + execution state',
      workflow: 'live lock -> step authoring -> optional primitive execution -> save'
    },
    userFlow: [
      'Select a live topic and lock the target object.',
      'Build sequence steps using the current object context.',
      'Optionally execute a primitive to test the draft.',
      'Save the resulting sequence when it matches intent.'
    ],
    expectedResult: ['You leave the page with a visually grounded action sequence tied to a tracked live object.'],
    userTips: ['Do not author sequence steps before the active object is reliably locked. Otherwise all later action references become unstable.'],
    guideHtml: `
      <div class="doc-block">
        <h3>RAIN operating order</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Choose the live topic and confirm the stream</span>
            <span class="step-detail">RAIN is built on a live visual context. If the stream is unstable, step authoring quality will also be unstable.</span>
          </li>
          <li>
            <span class="step-title">Prompt and lock the active object</span>
            <span class="step-detail">Do not write sequence steps until the active object is actually locked and trackable.</span>
          </li>
          <li>
            <span class="step-title">Pick the action type and author the step</span>
            <span class="step-detail">Use the right-side sequence controls to define the intended action in relation to the currently tracked object.</span>
          </li>
          <li>
            <span class="step-title">Repeat until the sequence is complete</span>
            <span class="step-detail">Build the task incrementally. Review step ordering after every addition instead of waiting until the end.</span>
          </li>
          <li>
            <span class="step-title">Test execution only when the draft is already coherent</span>
            <span class="step-detail">Primitive execution is for validating a draft, not for discovering basic sequence structure from scratch.</span>
          </li>
          <li>
            <span class="step-title">Save the sequence</span>
            <span class="step-detail">Persist the final sequence and record the saved path for later reuse or review.</span>
          </li>
        </ol>
      </div>
    `
  },
  steering: {
    title: 'Human Override',
    subtitle: 'Fast operator takeover and return-to-policy',
    purpose: 'Use Human Override when live inference is already running and the operator needs a minimal, fast control surface to take over or hand control back to the policy.',
    accessRule: 'Use together with Inference, not as a replacement for it.',
    bestFor: 'Runtime intervention during live policy execution',
    runtimeMode: 'Operator override',
    audience: ['Live robot operator', 'Safety monitor', 'Demo engineer'],
    prerequisites: [
      'Inference should already be running or ready to run.',
      'The operator should have an alternate manual control path available if the robot must be corrected physically or through teleoperation.',
      'Use this page only when you understand the current runtime phase.'
    ],
    features: [
      'Shows compact runtime state for robot, task, and current mode.',
      'Provides direct takeover and return-to-policy actions.',
      'Keeps a short event log of operator actions.',
      'Focuses only on the critical intervention path instead of full runtime control.'
    ],
    services: ['/task/command'],
    topics: ['/task/status', '/task/info'],
    inputs: ['Takeover or resume commands', 'Selected failure or intervention reason'],
    outputs: ['Runtime override state and short operator event history'],
    relatedPages: ['Inference is the main runtime page', 'Record command path is reused internally for intervention commands'],
    tech: {
      component: 'physical_ai_manager/src/pages/HumanSteeringPage.js',
      serviceHook: 'sendRecordCommand(command)',
      runtimeState: 'taskInfo + taskStatus mapped into operator badges',
      scope: 'minimal override-specific control surface'
    },
    userFlow: [
      'Open this page while inference is active or about to be active.',
      'Watch the current runtime mode badge.',
      'Take over when the robot needs human correction.',
      'Return control to the policy only after the scene is stable again.'
    ],
    expectedResult: ['The operator can intervene quickly without losing awareness of the current runtime state.'],
    userTips: ['This page is intentionally narrow. Start and configure inference elsewhere, then use this page only for intervention.'],
    guideHtml: `
      <div class="doc-block">
        <h3>When to use this page</h3>
        <p>Human Override is not the main inference UI. Use it when the system is already running and you want the shortest possible path to human takeover or return-to-policy actions.</p>
      </div>
      <div class="doc-block">
        <h3>Override workflow</h3>
        <ol class="step-list">
          <li>
            <span class="step-title">Check the current runtime mode</span>
            <span class="step-detail">The mode badge tells you whether autonomy is running, the system is idle, or human override is already active.</span>
          </li>
          <li>
            <span class="step-title">Take over when autonomy is no longer acceptable</span>
            <span class="step-detail">Use takeover when the robot is unsafe, drifting, or choosing the wrong affordance. Do not wait for the failure to become dramatic.</span>
          </li>
          <li>
            <span class="step-title">Correct the robot through the human path</span>
            <span class="step-detail">This page assumes another teleop or manual-control path exists. Use that path to recover the scene or robot state.</span>
          </li>
          <li>
            <span class="step-title">Return to policy only after stability returns</span>
            <span class="step-detail">Do not hand control back to autonomy while the robot is still in a partially corrected or ambiguous state.</span>
          </li>
        </ol>
      </div>
      <div class="doc-callout warn">
        <h3>Important limitation</h3>
        <ul>
          <li>This page does not replace the normal inference start flow.</li>
          <li>It is designed for operator-critical actions only.</li>
          <li>If you need full runtime setup, go back to Inference.</li>
        </ul>
      </div>
    `
  }
};
