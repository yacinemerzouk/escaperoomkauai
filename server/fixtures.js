if (Bolt.Collections.Settings.find().count() === 0) {
    Bolt.Collections.Settings.insert({
        settingType: 'global',
        companyName: 'Your Company Name',
        address: '456 Kuhio Hwy. Kapaa HI 96746',
        phone: '(808) 123-4567',
        email: 'contact@yourcompany.com'
    });
}