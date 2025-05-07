namespace OpenP.Services
{
    public class FileService(IWebHostEnvironment webHostEnvironment)
    {
        public async Task SaveFile(IFormFile file, string folderName, string fileName)
        {
            var path = Path.Combine(webHostEnvironment.WebRootPath, folderName);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var extension = Path.GetExtension(file.FileName);
            var filePath = Path.Combine(path, $"{fileName}{extension}");
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
        }
    
        public FileStream GetFile(string folderName, string fileName)
        {
            var directoryPath = Path.Combine(webHostEnvironment.WebRootPath, folderName);
            var files = Directory.GetFiles(directoryPath, $"{fileName}.*");
            if (files.Length > 0)
            {
                var filePath = files[0];
                return new FileStream(filePath, FileMode.Open);
            }
            throw new FileNotFoundException("Файл не найден");
        }
    }
}