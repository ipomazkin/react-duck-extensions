# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- OperationsExtension - extension for storing an operations state like fetch requests, data loading and other.
- CRUDExtension - extension for making CRUD operations. Composes StorageExtension and OperationsExtension

## [0.9.5] - 2021-04-05
### Added
- StateExtension - simple extension to store and manipulate reducer state via fields setting
- Added CHANGELOG.md

## [0.9.4] - 2021-04-04
### Added
- reduxStack.ts which contains basic stack interfaces
- Duck abstract class
- StorageExtension - extension for storing and manipulating model-like data
