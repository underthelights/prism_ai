(function () {
  if (!window.PAGE_DOCS) return;

  const guide = {
    home: {
      audience: ['Field operator', 'Project manager', 'New user'],
      userFlow: [
        'Check the heartbeat indicator first after opening Home.',
        'Select the Robot Type to lock the session context.',
        'Choose Record, Train, or Inference based on the goal of the session.',
        'Move to Devices first if a hardware check is needed.'
      ],
      expectedResult: ['The operating mode becomes explicit and mistakes from the wrong robot setting are reduced.'],
      userTips: ['Lock the robot type early. If it is wrong, dataset paths and policy paths can drift out of sync later.']
    },
    devices: {
      audience: ['Hardware check owner', 'Initial setup engineer'],
      userFlow: [
        'Confirm that every camera appears in Devices.',
        'Check that the robot model renders correctly in the URDF viewer.',
        'Move to Record or Inference only after the status reaches Ready.'
      ],
      expectedResult: ['Hardware issues are blocked before live recording or live inference begins.'],
      userTips: ['If the camera config is empty, check connection state and permissions before anything else.']
    },
    record: {
      audience: ['Data collection operator', 'Task experiment owner'],
      userFlow: [
        'Set the task instruction and the target number of episodes.',
        'Start recording and monitor the current phase.',
        'At episode end, label success or failure and record the reason precisely.',
        'Use Next to move into the next episode and repeat the loop.'
      ],
      expectedResult: ['You collect training-ready demonstrations together with failure metadata.'],
      userTips: ['Leaving failure reasons blank makes later filtering and debugging much harder.']
    },
    training: {
      audience: ['Model trainer', 'Research engineer'],
      userFlow: [
        'Select the policy family and dataset.',
        'Adjust batch size and steps to fit available GPU memory.',
        'Start training and monitor status, logs, and GPU load.',
        'Use checkpoint trends to decide whether to resume, restart, or stop.'
      ],
      expectedResult: ['You obtain reproducible training runs and deployable checkpoints.'],
      userTips: ['A missing required option can still produce a run, but the model quality may degrade sharply.']
    },
    inference: {
      audience: ['Robot operator', 'Deployment validation owner'],
      userFlow: [
        'Confirm that the selected policy path matches the robot type.',
        'Start inference and watch loading progress and logs until completion.',
        'Stop immediately if the robot behavior looks unsafe or unexpected.',
        'Feed the validation result back into the next data or training loop.'
      ],
      expectedResult: ['You validate on-hardware inference safely and assess policy quality in context.'],
      userTips: ['Do not interact before loading is complete, or you may create a UI and runtime state mismatch.']
    },
    datatools: {
      audience: ['Data curator', 'ML Ops owner'],
      userFlow: [
        'Select the dataset path and inspect its structure.',
        'Run the required edits such as merge, filter, or delete.',
        'Use quality checks to finalize the training dataset.',
        'Upload or download through Hugging Face when the team needs to share artifacts.'
      ],
      expectedResult: ['Training datasets meet a consistent format and quality bar.'],
      userTips: ['Always keep a backup of the original dataset before editing.']
    },
    augment: {
      audience: ['Augmentation owner', 'Generalization improvement owner'],
      userFlow: [
        'Choose either vision or language augmentation mode.',
        'Start with low intensity or ratio settings and inspect sample previews.',
        'Run the batch job and monitor progress and output folders.',
        'Compare performance after a small training run on the augmented data.'
      ],
      expectedResult: ['Dataset diversity increases and robustness to OOD conditions improves.'],
      userTips: ['Aggressive augmentation can hurt performance. Always compare against a baseline.']
    },
    visualize: {
      audience: ['Data analyst', 'Model debugger'],
      userFlow: [
        'Choose the dataset and episode, then inspect the parquet rows.',
        'Set scatter axes that match the behavior you want to inspect.',
        'Click outliers to trace back into the matching frame state.',
        'Interpret the issue with trajectory and camera frames together.'
      ],
      expectedResult: ['You can localize problem regions quickly with both numeric and frame-level evidence.'],
      userTips: ['Start from a single episode before widening the scope to the full dataset.']
    },
    sam2: {
      audience: ['Labeling owner', 'Vision pipeline owner'],
      userFlow: [
        'Select dataset, camera, and frame.',
        'Add point or box prompts for the target object.',
        'Run predict, then expand to track once the result looks correct.',
        'Save the final masks and recheck a few sample frames.'
      ],
      expectedResult: ['Object-level masks are generated and saved in a stable way.'],
      userTips: ['Prompt quality on the first frame usually determines the quality of the full track.']
    },
    rtsam: {
      audience: ['Live demo owner', 'Real-time vision operator'],
      userFlow: [
        'Select the live topic and verify that the stream is healthy.',
        'Prompt the target object by clicking or dragging and lock the mask.',
        'Use relock and fallback radius settings when drift appears.',
        'Keep only the objects you need once tracking becomes stable.'
      ],
      expectedResult: ['Object tracking stays active on the live view over time.'],
      userTips: ['Under large lighting shifts, manual relock is often more stable than auto-track.']
    },
    detection: {
      audience: ['Detection labeling owner', 'Data annotation team'],
      userFlow: [
        'Set the object prompt and detection thresholds.',
        'Check detection results for each camera.',
        'Save detections once the overlay quality looks correct.',
        'Scale out with batch detection when processing large datasets.'
      ],
      expectedResult: ['BBox and mask detections can be accumulated into dataset metadata.'],
      userTips: ['Specific noun phrases usually reduce false positives compared with vague prompts.']
    },
    tt: {
      audience: ['Sequence designer', 'Automation scenario owner'],
      userFlow: [
        'Define subtasks in the order the task should run.',
        'Review marker and segment inference results.',
        'Apply manual fixes when needed, then test primitive execution.',
        'Save the sequence and keep a JSON backup for versioning.'
      ],
      expectedResult: ['You build repeatable task orchestration sequences.'],
      userTips: ['If you ignore segment-gap warnings, missing steps can appear during execution.']
    },
    kinematics: {
      audience: ['Data conversion owner', 'Model input pipeline owner'],
      userFlow: [
        'Enter the dataset path and load the context.',
        'Set the base frame and target frame for the robot.',
        'Run convert to EEF.',
        'Validate the result with trajectory and scatter views.'
      ],
      expectedResult: ['Joint-centric datasets become usable for eef_pose-based analysis and training.'],
      userTips: ['Frame name typos are the most common failure source here.']
    },
    calib: {
      audience: ['Calibration engineer', 'On-site maintenance owner'],
      userFlow: [
        'Set camera, base frame, target frame, and port.',
        'Check server state through the status action.',
        'Start or restart the calibration tool.',
        'Review calibration quality against RMSE before applying results.'
      ],
      expectedResult: ['Drifted extrinsics are recovered and observation alignment improves.'],
      userTips: ['If the port is already in use, verify that the old process is cleared before restart.']
    },
    embedding: {
      audience: ['Model interpretation owner', 'Experiment comparison analyst'],
      userFlow: [
        'Select a saved model checkpoint.',
        'Set the dataset and sampling parameters.',
        'Run embedding extraction.',
        'Interpret cluster structure in the t-SNE or UMAP output.'
      ],
      expectedResult: ['You can quantify separation and mixing in the model representation space.'],
      userTips: ['Start with a smaller sample count to find sensible projection settings quickly.']
    },
    subgoal: {
      audience: ['Subtask annotation owner', 'Experimental feature validator'],
      userFlow: [
        'Select the dataset, camera, and episode.',
        'Choose either rule-based or keyframe mode.',
        'Run automatic segmentation, then correct the timeline manually.',
        'Save annotations and reload them to verify the result.'
      ],
      expectedResult: ['Episodes can be structured into step-level subgoal data.'],
      userTips: ['Because this is experimental, check backend readiness before relying on the page.']
    }
  };

  Object.keys(guide).forEach((k) => {
    if (!window.PAGE_DOCS[k]) return;
    window.PAGE_DOCS[k] = { ...window.PAGE_DOCS[k], ...guide[k] };
  });
})();
