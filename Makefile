all: lib

java_build:
	cd SimpleNetworking && gradle build

lib: java_build
	cp SimpleNetworking/library/build/outputs/aar/library-release.aar platforms/android/libs/SimpleNetworking.aar
