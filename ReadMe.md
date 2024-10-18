# App Versioning

* 4.19.2 
* Breakdown of the Version Number:
4 (Major version): Indicates the major release. Major versions typically introduce significant changes, including breaking changes that are not backward compatible.
19 (Minor version): Indicates the minor release. Minor versions generally add functionality in a backward-compatible manner.
2 (Patch version): Indicates the patch release. Patch versions usually include backward-compatible bug fixes.


* ^4.19.2 ----> By using this carrot(^) we are allowing our system to automatically update from the current version 4.19.2 to any version that will some with 4.x.x

* 4.19.2 ----> means our project will only use this 4.19.2 version only.

* ~4.19.2  : This version range allows updates to any version from 4.19.2 up to, but not including, 4.20.0.
Allowed versions: 4.19.2, 4.19.3, 4.19.4, etc.
Not allowed: 4.20.0 or higher.

# Package.lock.json and package.json
 - so in package.json we just say what version we can use but in the package.lock.json we can see what exact version our system is using right now.