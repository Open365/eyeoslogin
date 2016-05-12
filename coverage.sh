#!/bin/bash
istanbul cover --report cobertura --dir build/reports/ -x "**/vendor/**" -- grunt test
