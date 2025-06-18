#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p public/sounds

# Download sound effects
curl -L "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" -o public/sounds/correct.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3" -o public/sounds/wrong.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" -o public/sounds/background.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3" -o public/sounds/level-up.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2705/2705-preview.mp3" -o public/sounds/game-over.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3" -o public/sounds/button-click.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3" -o public/sounds/achievement.mp3 