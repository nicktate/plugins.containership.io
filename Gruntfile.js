var grunt = require("grunt");

grunt.loadNpmTasks("grunt-aws-s3");
grunt.loadNpmTasks("grunt-slack-notifier");

grunt.initConfig({
    aws: grunt.file.readJSON("grunt-aws.json"),

    aws_s3: {
        options: {
            accessKeyId: "<%= aws.key %>",
            secretAccessKey: "<%= aws.secret %>",
            access: "public-read",
            headers: {},
            progress: "progressBar",
            uploadConcurrency: 128,
            displayChangesOnly: true
        },

        production: {
            options: {
                bucket: "plugins.containership.io"
            },
            files: [
                {
                    src: ["plugins.json"],
                    dest: "plugins.json",
                    differential: true,
                    params: {
                        CacheControl: "600"
                    }
                }
            ]
        }
    },

    slack_notifier: {
        production: {
            options: {
                token: grunt.file.readJSON("grunt-slack.json"),
                channel: "#releases",
                text: "Deploying plugins.containership.io to production",
                username: "grunt"
            }
        }
    }
});

grunt.registerTask("production", ["aws_s3:production", "slack_notifier:production"]);
