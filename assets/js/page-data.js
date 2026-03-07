window.PAGE_DOCS = {
  home: {
    title: 'Home',
    subtitle: 'Robot type and session entry hub',
    purpose: 'Entry point for the full pipeline. Select the robot type, verify connectivity, and then move into the operating screens.',
    tech: {
      component: 'HomePage.js',
      redux: 'tasks.taskStatus, ui.currentPage',
      deps: 'RobotTypeSelector, HeartbeatStatus, buildInfo.json',
      navigation: 'moveToPage(PageType.DEVICES)'
    },
    features: [
      'Block entry until a robot type is selected and show toast feedback',
      'Show the build commit timestamp',
      'Provide workflow cards for Record, Augment, Train, and Inference',
      'Surface server heartbeat status at the top of the screen'
    ],
    services: ['setRobotType', 'getRobotTypeList'],
    topics: ['/task/status'],
    inputs: ['robotType', 'launch action'],
    outputs: ['selected robot context', 'page transition'],
    failureModes: [
      'No robotType: block pipeline start',
      'Unstable heartbeat: verify again before entering downstream pages'
    ],
    checklist: ['Select robot type', 'Confirm heartbeat connection', 'Choose operation mode (Record/Train/Infer)']
  },
  devices: {
    title: 'Devices',
    subtitle: 'Connected hardware and robot structure',
    purpose: 'Inspect camera and robot configuration, then verify hardware readiness before operation.',
    tech: {
      component: 'DevicesPage.js',
      serviceHook: 'useRosServiceCaller().getCameraConfig',
      viewer: 'URDFViewer (lazy loaded)',
      dataFlow: 'robotSpecs + camera config -> panel rendering'
    },
    features: [
      'Fetch camera configuration and show the latest update time',
      'Show robot control space and control type',
      'Visualize the robot model from URDF',
      'Display scan status as Scanning or Ready'
    ],
    services: ['/camera/get_config'],
    topics: ['/joint_states (viewer context)'],
    inputs: ['isActive', 'selected robot spec'],
    outputs: ['camera list', 'hardware health summary'],
    failureModes: ['If camera config lookup fails, fall back to default or cached information'],
    checklist: ['Confirm that every camera is detected', 'Confirm URDF loading', 'Confirm control mode']
  },
  record: {
    title: 'Record',
    subtitle: 'Data collection and episode annotation',
    purpose: 'Capture real manipulation demos and store episode-level quality labels alongside them.',
    tech: {
      component: 'RecordPage.js',
      commandService: 'sendRecordCommand',
      commandEnum: 'start_record, stop, next, rerecord, skip_task, finish',
      store: 'tasks/taskInfo + tasks/episodeResult'
    },
    features: [
      'Control collection with warmup, episode, and reset timing phases',
      'Store success or failure labels and failure taxonomy',
      'Send annotation payloads together with the next command',
      'Change UI state based on task phase transitions'
    ],
    services: ['/task/command'],
    topics: ['/task/status', '/task/info'],
    inputs: ['task instruction', 'episode success or failure reason', 'record mode parameters'],
    outputs: ['episode data', 'meta annotations'],
    failureModes: ['A send failure or timeout can leave the current episode state out of sync'],
    checklist: ['Confirm camera streams', 'Review the task instruction', 'Select a failure taxonomy when needed']
  },
  training: {
    title: 'Training',
    subtitle: 'VLA and IL policy training control',
    purpose: 'Run, stop, resume, and monitor policy training for each policy family from one screen.',
    tech: {
      component: 'TrainingPage.js',
      services: 'sendTrainingCommand, getDatasetList, getModelWeightList, getTrainingInfo',
      statusTopic: '/training/status',
      gpuTopic: '/system/gpu_status'
    },
    features: [
      'Configure hyperparameters by policy type',
      'Load dataset and checkpoint lists directly in the UI',
      'Show live training status, logs, and progress',
      'Support retrain and resume workflows from experiment history'
    ],
    services: ['/training/command', '/training/get_dataset_list', '/training/get_model_weight_list', '/training/get_training_info'],
    topics: ['/training/status', '/system/gpu_status'],
    inputs: ['policy type', 'dataset path', 'batch/steps/lr/etc'],
    outputs: ['checkpoints', 'training logs', 'experiment metadata'],
    failureModes: ['OOM, dataset schema mismatch, or weight load failure'],
    checklist: ['Check dataset structure', 'Check available VRAM', 'Check required options for the selected policy']
  },
  inference: {
    title: 'Inference',
    subtitle: 'Model loading and runtime execution',
    purpose: 'Load a trained policy into the real robot runtime and run the inference loop safely.',
    tech: {
      component: 'InferencePage.js',
      commandPath: '/task/command (start_inference/stop)',
      loadingTopic: '/inference/loading_status',
      viewer: 'URDFViewer + camera panels'
    },
    features: [
      'Show step-by-step loading progress for the selected policy',
      'Keep a history of loading logs and error messages',
      'Start and stop inference from the UI',
      'Preserve UI state while switching runtime phases'
    ],
    services: ['/task/command'],
    topics: ['/inference/loading_status', '/task/status'],
    inputs: ['policy path', 'task instruction', 'robot type'],
    outputs: ['runtime inference state', 'live execution'],
    failureModes: ['Checkpoint incompatibility or inference backend startup failure'],
    checklist: ['Confirm policy and robot match', 'Confirm initial pose and safety zone', 'Wait for loading state to reach Complete']
  },
  datatools: {
    title: 'Data Tools',
    subtitle: 'Dataset editing and validation workspace',
    purpose: 'Inspect structure, edit data, and move datasets through Hugging Face in one consistent workflow.',
    tech: {
      component: 'EditDatasetPage.js',
      tabs: 'Edit, Quality, Upload/Download',
      services: 'sendEditDatasetCommand, getDatasetInfo, checkDatasetQuality, browseFile'
    },
    features: [
      'Merge or delete episodes and copy filtered subsets',
      'Validate LeRobot dataset structure',
      'Connect Hugging Face users and repositories',
      'Pick paths through a file-browser workflow'
    ],
    services: ['/dataset/edit', '/dataset/get_info', '/dataset/check_quality', '/browse_file'],
    topics: ['/dataset/edit_status (internal status stream)'],
    inputs: ['dataset root', 'edit command', 'hf user'],
    outputs: ['edited dataset', 'quality report'],
    failureModes: ['File permission issues or metadata file mismatch'],
    checklist: ['Back up the source dataset', 'Confirm the target dataset selection', 'Run quality checks before sending to training']
  },
  augment: {
    title: 'Augment',
    subtitle: 'Vision and language data augmentation',
    purpose: 'Expand input diversity in a controlled way to improve generalization during training.',
    tech: {
      component: 'DataAugmentationPage.js',
      mode: 'vision | language',
      configStore: 'augmentationSlice',
      statusTopic: '/augmentation/status'
    },
    features: [
      'Vision: lightness, salt-pepper, gaussian, blur, and color jitter',
      'Language: generate and map instruction variants',
      'Preview sample outputs before running at scale',
      'Track batch execution, progress, and output folders'
    ],
    services: ['/dataset/augment', '/dataset/get_sample_image', '/image/get_available_list'],
    topics: ['/augmentation/status'],
    inputs: ['dataset', 'augmentation config json', 'output folder'],
    outputs: ['augmented dataset'],
    failureModes: ['Invalid config, missing source dataset, or interruption during long batch jobs'],
    checklist: ['Validate augmentation ratios', 'Inspect sample previews', 'Check for output folder collisions']
  },
  visualize: {
    title: 'Visualize',
    subtitle: 'State, trajectory, and sensor analysis',
    purpose: 'Explore dataset state at frame, episode, and full-dataset scope to analyze quality and patterns.',
    tech: {
      component: 'VisualizePage.js',
      dataService: 'getParquetData, getDatasetInfo, getDatasetSampleImage, getScatterPlotData',
      views: 'table, scatter, trajectory, camera frames',
      rendering: 'canvas + three.js hybrid'
    },
    features: [
      'Inspect Parquet and HDF5 records',
      'Render EEF trajectories in 2D and 3D',
      'Run scatter analysis with selectable x and y axes',
      'Load the matching frame state when a point is selected'
    ],
    services: ['/dataset/get_parquet_data', '/dataset/get_scatter_plot_data', '/dataset/get_sample_image', '/dataset/get_info'],
    topics: ['(mainly service driven)'],
    inputs: ['dataset path', 'episode/frame', 'axis fields'],
    outputs: ['visual plots', 'state snapshots'],
    failureModes: ['Slow loading on large datasets or axis column mismatch'],
    checklist: ['Validate dataset path', 'Define the axes of interest', 'Tag outlier regions for follow-up']
  },
  sam2: {
    title: 'SAM2',
    subtitle: 'Offline frame segmentation and tracking',
    purpose: 'Apply object prompts to dataset frames, generate masks, track them, and save the results.',
    tech: {
      component: 'SAM2Page.js',
      services: 'sam2Predict, sam2Track, sam2SaveMasks, sam2GetMask',
      prompts: 'point(+/-), box, frame scope',
      storage: 'meta masks by episode/camera'
    },
    features: [
      'Manage prompt state per object',
      'Manage tracking tasks and fetch masks per frame',
      'Overlay masks with object-id color coding',
      'Choose output formats such as PNG'
    ],
    services: ['/sam2/predict', '/sam2/track', '/sam2/save_masks', '/sam2/get_mask'],
    topics: ['/annotation/sam2_tracking_status'],
    inputs: ['dataset/camera/frame', 'prompts', 'tracking options'],
    outputs: ['object masks', 'tracking results'],
    failureModes: ['Missing prompts, tracking drift, or mask size mismatch'],
    checklist: ['Check prompt quality on representative frames', 'Review cross-camera consistency', 'Inspect overlays before saving']
  },
  rtsam: {
    title: 'Realtime SAM2',
    subtitle: 'Live stream tracking',
    purpose: 'Select objects on a live video stream and maintain real-time mask tracking.',
    tech: {
      component: 'RealtimeSAMInferencePage.js',
      stream: 'mjpeg stream + topic polling',
      service: 'sam2RealtimeInfer',
      state: 'objects, prompts, tracking scope, fallback radius'
    },
    features: [
      'Select and reload topics while handling stream delay',
      'Create prompts by click or drag interaction',
      'Control relock and auto-track behavior',
      'Manage color and state per tracked object'
    ],
    services: ['/sam2/realtime_infer', '/image/get_available_list'],
    topics: ['/annotation/realtime_sam_status'],
    inputs: ['selected topic', 'prompt points', 'poll interval'],
    outputs: ['live masks', 'tracking status'],
    failureModes: ['Network delay, topic churn, or tracker warm-up failure'],
    checklist: ['Check topic freshness', 'Start with two or three prompt points', 'Use relock when drift appears']
  },
  detection: {
    title: 'Detection',
    subtitle: 'Grounding DINO object detection',
    purpose: 'Run prompt-driven object detection and store per-camera results.',
    tech: {
      component: 'ObjectDetectionPage.js',
      services: 'detectObjects, saveDetections, batchDetectObjects',
      postprocess: 'mask decode + overlay composition',
      statusTopic: '/annotation/batch_detection_status'
    },
    features: [
      'Run parallel detection per camera',
      'Tune box and text thresholds',
      'Render colored mask overlays for detections',
      'Save outputs into meta/detections'
    ],
    services: ['/annotation/detect_objects', '/annotation/save_detections', '/annotation/batch_detect_objects'],
    topics: ['/annotation/batch_detection_status'],
    inputs: ['object prompt', 'dataset path', 'episode/frame'],
    outputs: ['detections + masks'],
    failureModes: ['Zero detections, mask decode failure, or save-path permission issues'],
    checklist: ['Refine the prompt wording', 'Tune thresholds', 'Recheck samples after saving']
  },
  tt: {
    title: 'Task Orchestration',
    subtitle: 'Primitive sequence design and execution',
    purpose: 'Define complex tasks as reusable primitives and save them as executable sequences.',
    tech: {
      component: 'TaskOrchestrationPage.js',
      services: 'executePrimitive, saveTaskSequence',
      logic: 'marker detection + subtask segmentation heuristics',
      backup: 'json export'
    },
    features: [
      'Build steps from subtask types',
      'Estimate markers in real time and correct frame alignment',
      'Test individual primitive execution',
      'Save sequences and download backup files'
    ],
    services: ['/orchestration/execute_primitive', '/orchestration/save_task_sequence'],
    topics: ['/task/status', '/orchestration/status'],
    inputs: ['task text', 'subtask list', 'frame markers'],
    outputs: ['task sequence json', 'execution result'],
    failureModes: ['Segment gaps, marker mismatch, or primitive execution failure'],
    checklist: ['Review subtask order', 'Resolve gap and warning states', 'Run a dry-run before execution']
  },
  kinematics: {
    title: 'Kinematics',
    subtitle: 'Joint to end-effector conversion',
    purpose: 'Convert joint-state-based data with forward kinematics to create observation.eef_pose.',
    tech: {
      component: 'KinematicsPage.js',
      services: 'getDatasetInfo, getParquetData, getScatterPlotData, convertToEEF',
      defaults: 'base and target frame presets per robot type',
      preview: 'XY/XZ trajectory preview'
    },
    features: [
      'Load dataset context automatically',
      'Set the base frame and target link',
      'Run convertToEEF and inspect the result',
      'Revalidate the converted data with scatter and trajectory views'
    ],
    services: ['/dataset/convert_to_eef', '/dataset/get_info', '/dataset/get_parquet_data', '/dataset/get_scatter_plot_data'],
    topics: ['(service-driven)'],
    inputs: ['dataset path', 'base frame', 'target frame'],
    outputs: ['eef_pose-enriched dataset'],
    failureModes: ['URDF link mismatch or missing joint columns'],
    checklist: ['Check frame naming accuracy', 'Validate sample trajectories', 'Confirm downstream model input columns']
  },
  calib: {
    title: 'Camera Calibration',
    subtitle: 'Extrinsic calibration control',
    purpose: 'Operate the calibration server from the UI to recover camera extrinsics after drift.',
    tech: {
      component: 'CameraCalibrationPage.js',
      service: 'controlCameraCalibration',
      actions: 'status/start/restart/stop',
      bridge: 'tool url + iframe reload'
    },
    features: [
      'Configure camera, base frame, target frame, and port',
      'Check calibration server status',
      'Start, restart, and stop the calibration server',
      'Auto-detect and apply the tool host'
    ],
    services: ['/camera/calibration/control'],
    topics: ['/camera/calibration/status'],
    inputs: ['camera name', 'frames', 'port'],
    outputs: ['calibration server state'],
    failureModes: ['Port conflict or tool-host mismatch'],
    checklist: ['Set the target frame', 'Review RMSE criteria', 'Inspect sample frames after applying results']
  },
  embedding: {
    title: 'Embedding',
    subtitle: 'Model latent-space analysis',
    purpose: 'Extract embeddings from saved policies and analyze their distribution and clustering.',
    tech: {
      component: 'EmbeddingPage.js',
      services: 'getSavedPolicies, extractModelEmbeddings',
      projection: 't-SNE/UMAP',
      viz: 'canvas render + pan/zoom/hover'
    },
    features: [
      'Browse and select saved models',
      'Tune method, perplexity, neighbors, and other projection parameters',
      'Map colors by label',
      'Inspect details by hovering sample points'
    ],
    services: ['/get_saved_policies', '/embedding/extract'],
    topics: ['/embedding/extraction_status'],
    inputs: ['model path', 'dataset path', 'projection params'],
    outputs: ['embedding vectors', '2D projection plot'],
    failureModes: ['Missing model config or running out of memory during extraction'],
    checklist: ['Validate checkpoint integrity', 'Adjust sample count limits', 'Interpret clusters against the chosen label']
  },
  subgoal: {
    title: 'Subgoal Annotation (Experimental)',
    subtitle: 'Rule-based and keyframe-driven subgoal annotation',
    purpose: 'Split episode frames into subtask segments, apply manual correction, and save the result.',
    tech: {
      component: 'SubgoalAnnotationPage.js',
      note: 'Currently not connected to the main App navigation',
      modes: 'rule_based, keyframe_detection',
      services: 'detectKeyframes, segmentEpisode, saveAnnotation, loadAnnotation'
    },
    features: [
      'Run rule-based segmentation from parsed instructions',
      'Use Grounding, ActionVariance, or OpticalFlow keyframe detection',
      'Edit phases with trajectory overlays',
      'Save and load annotation JSON files'
    ],
    services: ['/dataset/segment_episode', '/dataset/detect_keyframes', '/dataset/save_annotation', '/dataset/load_annotation'],
    topics: ['/annotation/keyframe_status'],
    inputs: ['dataset/camera/episode', 'instruction', 'tracker config'],
    outputs: ['subgoal frames/phases/descriptions'],
    failureModes: ['Backend service not ready or trajectory scale mismatch'],
    checklist: ['Select camera and episode', 'Choose a mode', 'Review the timeline before saving']
  }
};
