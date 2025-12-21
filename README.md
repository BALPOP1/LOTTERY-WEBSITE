# 🎰 Quina Lottery Results

A static website that displays winning numbers from Brazil's Quina lottery, automatically fetched from megasena.com and hosted on GitHub Pages.

![Quina Results](https://img.shields.io/badge/Lottery-Quina-purple)
![Auto Update](https://img.shields.io/badge/Updates-Every%203%20Hours-green)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue)

## ✨ Features

- 🔄 **Auto-updating** - Results fetched automatically every 3 hours via GitHub Actions
- 📱 **Responsive design** - Works on desktop and mobile
- ⚡ **Fast loading** - Static site with no server required
- 🆓 **Free hosting** - Runs entirely on GitHub (Pages + Actions)
- 📊 **Historical data** - Stores last 30 lottery results

## 🚀 Quick Setup

### 1. Fork or Clone this Repository

```bash
git clone https://github.com/YOUR-USERNAME/LOTTERY-WEBSITE.git
cd LOTTERY-WEBSITE
```

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/LOTTERY-WEBSITE.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

Your site will be live at: `https://YOUR-USERNAME.github.io/LOTTERY-WEBSITE/`

### 4. Enable GitHub Actions

The workflow should run automatically. To trigger manually:

1. Go to **Actions** tab
2. Click **Fetch Quina Results**
3. Click **Run workflow** → **Run workflow**

## 📁 Project Structure

```
LOTTERY-WEBSITE/
├── index.html              # Main HTML page
├── styles.css              # Styling
├── script.js               # Frontend JavaScript
├── data/
│   └── results.json        # Lottery results (auto-updated)
├── scripts/
│   └── fetch_quina.py      # Python scraper
├── requirements.txt        # Python dependencies
├── .github/
│   └── workflows/
│       └── fetch-results.yml  # GitHub Actions workflow
└── README.md
```

## 🔧 How It Works

1. **GitHub Actions** runs the Python scraper every 3 hours
2. The scraper fetches results from megasena.com
3. New results are saved to `data/results.json`
4. Changes are automatically committed to the repository
5. **GitHub Pages** serves the static website
6. The frontend reads from `results.json` and displays the numbers

## 🛠️ Local Development

### Run the website locally

Simply open `index.html` in a web browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

### Run the scraper manually

```bash
# Install dependencies
pip install -r requirements.txt

# Run scraper
python scripts/fetch_quina.py
```

## 📝 Configuration

### Change fetch frequency

Edit `.github/workflows/fetch-results.yml`:

```yaml
schedule:
  # Every hour
  - cron: '0 * * * *'
  
  # Every 6 hours
  - cron: '0 */6 * * *'
  
  # Daily at midnight UTC
  - cron: '0 0 * * *'
```

### Keep more/fewer results

Edit `scripts/fetch_quina.py`:

```python
MAX_RESULTS = 30  # Change this number
```

## ⚠️ Troubleshooting

### Results not updating

1. Check **Actions** tab for failed workflows
2. Ensure GitHub Actions is enabled in repository settings
3. Try running the workflow manually

### Website not loading

1. Verify GitHub Pages is enabled
2. Check the Pages URL is correct
3. Wait a few minutes after enabling Pages

### Scraper errors

The scraper may fail if megasena.com changes their HTML structure. Check the error logs in GitHub Actions and update the parsing logic in `fetch_quina.py` if needed.

## 📜 License

MIT License - feel free to use and modify!

## 🙏 Credits

- Data source: [megasena.com](https://megasena.com/en/quina/results)
- Hosting: [GitHub Pages](https://pages.github.com/)
- Automation: [GitHub Actions](https://github.com/features/actions)

