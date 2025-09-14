#!/usr/bin/env bash

# Start Gunicorn for the Flask backend
gunicorn backend.app:app --bind 0.0.0.0:$PORT


