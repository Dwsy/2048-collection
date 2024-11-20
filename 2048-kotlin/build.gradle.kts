plugins {
    kotlin("js") version "1.8.20"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    maven { url = uri("https://maven.aliyun.com/repository/public") }
    maven { url = uri("https://maven.aliyun.com/repository/gradle-plugin") }
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-js")
    implementation("org.jetbrains.kotlin-wrappers:kotlin-extensions:1.0.1-pre.632")
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.8.0")
    testImplementation(kotlin("test"))
}

kotlin {
    js(IR) {
        browser {
            commonWebpackConfig {
                cssSupport {
                    enabled.set(true)
                }
            }
            distribution {
                directory = File("$projectDir/build/distributions/")
            }
        }
        binaries.executable()
    }
}
