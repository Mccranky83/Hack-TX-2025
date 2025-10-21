#!/usr/bin/env -S zsh -e

# --- Configuration ---
# Set the directory where the object detection project resides.
readonly OBJECT_DETECTION_DIR="./object-detection"
readonly VENV_DIR="venv"
readonly REQUIREMENTS_FILE="requirements.txt"
readonly WEBRTC_SCRIPT="webrtc_demo.py"

# --- Functions ---

# Function to print a formatted error message and exit.
# Arguments:
#   $1: The error message to display.
#   $2: The exit code (optional, defaults to 1).
err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: ERROR: $*" >&2
  exit "${2:-1}"
}

# --- Main Script ---

# 1. Check if the project directory exists.
if [[ ! -d "$OBJECT_DETECTION_DIR" ]]; then
  err "Directory '$OBJECT_DETECTION_DIR' not found."
fi

cd "$(git rev-parse --show-toplevel)"
cd "$OBJECT_DETECTION_DIR"

# 2. Check for the existence of Python and npm.
command -v python3 >/dev/null 2>&1 || err "python3 is not installed or not in the PATH."
command -v npm >/dev/null 2>&1 || err "npm is not installed or not in the PATH."

# 3. Set up and activate the Python virtual environment.
if [[ ! -d "$VENV_DIR" ]]; then
  echo "Creating Python virtual environment..."
  python3 -m venv "$VENV_DIR" || err "Failed to create the virtual environment."
fi

# The 'source' command should not be used with '-e' if the activation script
# might not exist. We've already checked for the directory, so this is safer.
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

# 4. Install Python dependencies.
if [[ ! -f "$REQUIREMENTS_FILE" ]]; then
  err "The '$REQUIREMENTS_FILE' file was not found."
fi

echo "Installing Python dependencies..."
pip3 install -r "$REQUIREMENTS_FILE" || err "Failed to install Python dependencies from '$REQUIREMENTS_FILE'."

# 5. Run the applications.
# Check if the Python script and package.json exist before trying to run them.
if [[ ! -f "$WEBRTC_SCRIPT" ]]; then
  err "The '$WEBRTC_SCRIPT' script was not found."
fi

echo "Starting the WebRTC demo in the background..."
python3 "./$WEBRTC_SCRIPT"
PYTHON_PID=$!
