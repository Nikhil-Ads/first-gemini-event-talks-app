// build.js

const fs = require('fs');
const path = require('path');

// Dummy Talk Data
const talksData = [
    {
        title: "Introduction to Generative AI",
        speakers: ["Dr. Alex W.", "Dr. J. Doe"],
        categories: ["AI", "Machine Learning"],
        duration: 60,
        description: "An overview of the latest advancements in generative AI and its applications across various industries."
    },
    {
        title: "Scalable Cloud Architectures",
        speakers: ["Jane S."],
        categories: ["Cloud", "Architecture"],
        duration: 60,
        description: "Exploring patterns and best practices for building scalable and resilient applications on cloud platforms."
    },
    {
        title: "Frontend Frameworks in 2026",
        speakers: ["Carlos R."],
        categories: ["Web Development", "Frontend"],
        duration: 60,
        description: "A deep dive into the most popular and emerging frontend frameworks, comparing their strengths and weaknesses."
    },
    {
        title: "Cybersecurity Best Practices",
        speakers: ["Sarah L."],
        categories: ["Security"],
        duration: 60,
        description: "Essential cybersecurity practices for developers and organizations to protect against modern threats."
    },
    {
        title: "Data Engineering Pipelines",
        speakers: ["Mike T."],
        categories: ["Data", "Engineering"],
        duration: 60,
        description: "Building efficient and robust data pipelines for large-scale data processing and analytics."
    },
    {
        title: "DevOps and CI/CD Automation",
        speakers: ["Emily P."],
        categories: ["DevOps", "Automation"]
        ,
        duration: 60,
        description: "Automating software delivery with continuous integration and continuous deployment practices."
    }
];

// Function to generate the event schedule
function generateSchedule(talks, startTimeStr, lunchBreakAfterTalkIndex) {
    const schedule = [];
    let currentTime = new Date(`2026-05-26T${startTimeStr}:00`); // Use a dummy date

    for (let i = 0; i < talks.length; i++) {
        const talk = talks[i];
        const talkStartTime = new Date(currentTime);
        const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime: talkStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        currentTime = new Date(talkEndTime);

        // Add 10-minute transition
        if (i < talks.length - 1) {
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }

        // Add lunch break after the specified talk
        if (i === lunchBreakAfterTalkIndex - 1) {
            const lunchStartTime = new Date(currentTime);
            currentTime.setMinutes(currentTime.getMinutes() + 60); // 1 hour lunch
            const lunchEndTime = new Date(currentTime);
            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                duration: 60,
                startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            // Add 10-minute transition after lunch if there are more talks
            if (i < talks.length - 1) {
                currentTime.setMinutes(currentTime.getMinutes() + 10);
            }
        }
    }
    return schedule;
}

const eventStartTime = '10:00';
const lunchBreakAfter = 2; // After the 2nd talk
const scheduleData = generateSchedule(talksData, eventStartTime, lunchBreakAfter);

// Read template files
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Inject data and scripts into the HTML template
const finalHtml = htmlTemplate
    .replace('<!-- INJECT_CSS -->', `<style>${cssContent}</style>`)
    .replace('<!-- INJECT_JS -->', `<script>${jsContent}</script>`)
    .replace('<!-- INJECT_TALKS_DATA -->', `<script>const allTalksData = ${JSON.stringify(talksData, null, 2)};</script>`)
    .replace('<!-- INJECT_SCHEDULE_DATA -->', `<script>const eventScheduleData = ${JSON.stringify(scheduleData, null, 2)};</script>`);

// Write the final HTML file
fs.writeFileSync(path.join(__dirname, 'index.html'), finalHtml);

console.log('index.html generated successfully!');
