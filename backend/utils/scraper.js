const puppeteer = require("puppeteer");
const Job = require("../models/Job");

const scrapeJobs = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://remoteok.io");

    const jobs = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".job")).map(job => ({
            title: job.querySelector(".title")?.innerText || "",
            company: job.querySelector(".company")?.innerText || "",
            location: job.querySelector(".location")?.innerText || "",
            url: job.querySelector("a")?.href || ""
        }))
    );

    await browser.close();
    await Job.insertMany(jobs);
};

scrapeJobs();
