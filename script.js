let defaultJobs = [
    {
        id: 1,
        title: "Frontend Web Developer",
        company: "TechCorp Solutions",
        location: "Remote",
        salary: "$70,000 - $85,000 / year",
        desc: "We are looking for a skilled HTML/CSS/JavaScript developer to build responsive web interfaces."
    },
    {
        id: 2,
        title: "UI/UX Designer",
        company: "Creative Studio",
        location: "Kolkata, India",
        salary: "₹5,00,000 - ₹8,00,000 / year",
        desc: "Design clean user interfaces and enhance user experience across web platforms."
    },
    {
        id: 3,
        title: "Full Stack Engineer",
        company: "InnovateX",
        location: "Hybrid",
        salary: "$90,000 / year",
        desc: "Handle both frontend UI and backend API integrations efficiently."
    }
];

let jobs = JSON.parse(localStorage.getItem('job_board_jobs')) || defaultJobs;
let applications = JSON.parse(localStorage.getItem('job_board_apps')) || [];
let selectedJobId = null;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    if (pageId === 'home-page') renderFeaturedJobs();
    if (pageId === 'jobs-page') renderAllJobs();
    if (pageId === 'candidate-dashboard') renderApplications();
}

function renderFeaturedJobs() {
    let container = document.getElementById('featured-jobs');
    container.innerHTML = '';
    jobs.slice(0, 3).forEach(job => {
        container.appendChild(createJobCard(job));
    });
}

function renderAllJobs() {
    let container = document.getElementById('all-jobs');
    container.innerHTML = '';
    jobs.forEach(job => {
        container.appendChild(createJobCard(job));
    });
}

function createJobCard(job) {
    let card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <h3>${job.title}</h3>
        <p><b>Company:</b> ${job.company}</p>
        <p><b>Location:</b> ${job.location}</p>
        <p><b>Salary:</b> ${job.salary}</p>
        <button class="btn-view" onclick="viewJobDetail(${job.id})">View Details & Apply</button>
    `;
    return card;
}

function viewJobDetail(id) {
    selectedJobId = id;
    let job = jobs.find(j => j.id === id);
    let detailDiv = document.getElementById('job-detail-content');
    
    detailDiv.innerHTML = `
        <h2>${job.title}</h2>
        <p style="color:#0284c7; font-weight:bold; margin-bottom:10px;">${job.company} - ${job.location}</p>
        <p><b>Salary:</b> ${job.salary}</p>
        <hr style="margin: 15px 0;">
        <h4>Job Description:</h4>
        <p style="margin-top: 5px; line-height: 1.6;">${job.desc}</p>
    `;
    
    document.getElementById('app-msg').innerText = '';
    document.getElementById('apply-form').reset();
    showPage('job-detail-page');
}

function filterJobs() {
    let query = document.getElementById('job-search-input').value.toLowerCase();
    let container = document.getElementById('all-jobs');
    container.innerHTML = '';

    let filtered = jobs.filter(j => 
        j.title.toLowerCase().includes(query) || 
        j.company.toLowerCase().includes(query) || 
        j.location.toLowerCase().includes(query)
    );

    filtered.forEach(job => container.appendChild(createJobCard(job)));
}

function searchJobsFromHome() {
    let query = document.getElementById('home-search-input').value;
    showPage('jobs-page');
    document.getElementById('job-search-input').value = query;
    filterJobs();
}

function submitApplication(e) {
    e.preventDefault();
    let name = document.getElementById('applicant-name').value;
    let email = document.getElementById('applicant-email').value;
    let job = jobs.find(j => j.id === selectedJobId);

    let app = {
        jobTitle: job.title,
        company: job.company,
        applicantName: name,
        applicantEmail: email,
        date: new Date().toLocaleDateString()
    };

    applications.push(app);
    localStorage.setItem('job_board_apps', JSON.stringify(applications));

    document.getElementById('app-msg').innerText = `Application submitted successfully! An automated notification email has been sent to ${email}.`;
    document.getElementById('apply-form').reset();
}

function renderApplications() {
    let list = document.getElementById('applied-jobs-list');
    list.innerHTML = '';

    if (applications.length === 0) {
        list.innerHTML = '<p>No applications submitted yet.</p>';
        return;
    }

    applications.forEach(app => {
        let div = document.createElement('div');
        div.style.cssText = "padding:10px; border-bottom:1px solid #ddd; margin-bottom:10px;";
        div.innerHTML = `
            <h4>${app.jobTitle} at ${app.company}</h4>
            <p><small>Applied on: ${app.date} | Email: ${app.applicantEmail}</small></p>
            <span style="color:green; font-size:12px; font-weight:bold;">Status: Application Received</span>
        `;
        list.appendChild(div);
    });
}

function createNewJob(e) {
    e.preventDefault();
    let newJob = {
        id: Date.now(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        salary: document.getElementById('job-salary').value,
        desc: document.getElementById('job-desc').value
    };

    jobs.push(newJob);
    localStorage.setItem('job_board_jobs', JSON.stringify(jobs));

    document.getElementById('post-msg').innerText = "Job Posted Successfully!";
    document.getElementById('post-job-form').reset();
}

// Initial Call
renderFeaturedJobs();
